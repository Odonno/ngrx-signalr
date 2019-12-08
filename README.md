# ngrx-signalr

A library to handle realtime SignalR (.NET Framework) events using angular, rxjs and the @ngrx library.

*This library is made for the SignalR client using .NET Framework. If you need target .NET Core, please check this repository : https://github.com/Odonno/ngrx-signalr-core*

## Get started

### Install dependencies

Once you created your angular project, you need to install all the libraries required to create the communication between angular and a SignalR hub.

```
npm install rxjs --save
npm install @ngrx/store @ngrx/effects --save
npm install ngrx-signalr --save
```

Don't forget to add the dependency in the `angular.json` file so angular will automatically inject the `$` and `$.hubConnection` function used to initialize signalr.

```
npm install jquery signalr --save
npm install @types/signalr @types/jquery --save-dev
```

```json
{
    "projects": {
        "architect": {
            "build": {
                "scripts": [
                    "./node_modules/jquery/dist/jquery.js",
                    "./node_modules/signalr/jquery.signalR.js"
                ]
            }
        }
    }
}
```

Once everything is installed, you can use the reducer and the effects inside the `AppModule`.

```js
@NgModule({
    ...,
    imports: [
        StoreModule.forRoot({ signalr: signalrReducer }),
        EffectsModule.forRoot([SignalREffects, AppEffects])
    ],
    ...
})
export class AppModule { }
```

<details>
<summary>Start with a single Hub...</summary>
<br>

First, you will start the application by dispatching the creation of one Hub.

```ts
// TODO : your hub definition
const hub = {
    hubName: 'hub name',
    url: 'https://localhost/path'
};

this.store.dispatch(
    createSignalRHub(hub)
);
```

Then you will create an effect to start listening to events before starting the Hub.

```ts
initRealtime$ = createEffect(() => 
    this.actions$.pipe(
        ofType(SIGNALR_HUB_UNSTARTED),
        mergeMapHubToAction(({ hub }) => {
            // TODO : add event listeners
            const whenEvent$ = hub.on('eventName').pipe(
                map(x => createAction(x))
            );

            return merge(
                whenEvent$,
                of(startSignalRHub(hub))
            );
        })
    )
);
```

You can also send events at anytime.

```ts
sendEvent$ = createEffect(() => 
    this.actions$.pipe(
        ofType(SEND_EVENT), // TODO : create a custom action
        mergeMap(({ params }) => {
            const hub = findHub(timeHub);
            if (!hub) {
                return of(hubNotFound(timeHub));
            }

            // TODO : send event to the hub
            return hub.send('eventName', params).pipe(
                map(_ => sendEventFulfilled()),
                catchError(error => of(sendEventFailed(error)))
            );
        })
    )
);
```

</details>

<details>
<summary>...or use multiple Hubs</summary>
<br>

Now, start with multiple hubs at a time.

```ts
// simplified hub creation
const dispatchHubCreation = (hub) => this.store.dispatch(createSignalRHub(hub));

const hub1 = {}; // define hubName and url
const hub2 = {}; // define hubName and url
const hub3 = {}; // define hubName and url

dispatchHubCreation(hub1);
dispatchHubCreation(hub2);
dispatchHubCreation(hub3);
```

You will then initialize your hubs in the same way but you need to know which one is initialized.

```ts
const hub1 = {}; // define hubName and url
const hub2 = {}; // define hubName and url

initHubOne$ = createEffect(() => 
    this.actions$.pipe(
        ofType(SIGNALR_HUB_UNSTARTED),
        ofHub(hub1),
        mergeMapHubToAction(({ action, hub }) => {
            // TODO : init hub 1
        })
    )
);

initHubTwo$ = createEffect(() => 
    this.actions$.pipe(
        ofType(SIGNALR_HUB_UNSTARTED),
        ofHub(hub2),
        mergeMapHubToAction(({ action, hub }) => {
            // TODO : init hub 2
        })
    )
);
```

And then you can start your app when all hubs are connected the first time.

```ts
appStarted$ = createEffect(() => 
    this.store.pipe(
        select(selectAreAllHubsConnected),
        filter(areAllHubsConnected => !!areAllHubsConnected),
        first(),
        map(_ => of(appStarted())) // TODO : create a custom action when hubs are connected
    )
);
```

</details>

<details>
<summary>Handling reconnection</summary>
<br>

By design in .NET Framework, a SignalR client will attempt to reconnect to the server automatically until a specified threshold time is reached. Until we reached this limit (of 30 seconds by default), the hub is in `reconnecting` mode. After that, the hub switch to `disconnected` mode and no further attempt is made to reconnect.

So, if you want to reconnect to the hub in `disconnected` state, you have to handle it manually by writing an `effect`.

```ts
// try to reconnect every 10s (when the navigator is online)
whenDisconnected$ = createReconnectEffect(this.actions$, 10 * 1000);
```

In this example, we apply a periodic reconnection attempt every 10 seconds when the hub is `disconnected` and when there is a network connection.

Of course, you can write your own `Effect` to you have the benefit to write your own reconnection pattern (periodic retry, exponential retry, etc..).

</details>

## API features

<details>
<summary>SignalR Hub</summary>
<br>

The SignalR Hub is an abstraction of the hub connection. It contains function you can use to:

* start the connection
* listen to events emitted
* send a new event

```ts
interface ISignalRHub {
    hubName: string;
    url?: string;

    start$: Observable<void>;
    stop$: Observable<void>;
    state$: Observable<string>;
    error$: Observable<SignalR.ConnectionError>;

    constructor(hubName: string, url?: string, useSharedConnection?: boolean);

    start(options?: SignalR.ConnectionOptions): Observable<void>;
    stop(async?: boolean, notifyServer?: boolean): Observable<void>;
    on<T>(event: string): Observable<T>;
    send(method: string, ...args: any[]): Observable<any>;
    hasSubscriptions(): boolean;
}
```

You can find an existing hub by its name and url.

```ts
function findHub(hubName: string, url?: string): ISignalRHub | undefined;
function findHub({ hubName, url }: {
    hubName: string;
    url?: string;
}): ISignalRHub | undefined;
```

And create a new hub.

```ts
function createHub(hubName: string, url?: string, useSharedConnection?: boolean): ISignalRHub;
```

</details>

<details>
<summary>State</summary>
<br>

The state contains all existing hubs that was created with their according status (unstarted, connecting, connected, disconnected, reconnecting).

```ts
const unstarted = "unstarted";
const connecting = "connecting";
const connected = "connected";
const disconnected = "disconnected";
const reconnecting = "reconnecting";

type SignalRHubState = 
    | typeof unstarted 
    | typeof connecting 
    | typeof connected 
    | typeof disconnected 
    | typeof reconnecting;

type SignalRHubStatus = {
    hubName: string;
    url?: string;
    state: SignalRHubState;
};
```

```ts
class BaseSignalRStoreState {
    hubStatuses: SignalRHubStatus[];
}
```

</details>

<details>
<summary>Actions</summary>
<br>

`createSignalRHub` will initialize a new hub connection but it won't start the connection so you can create event listeners.

```ts
const createSignalRHub = createAction(
    '@ngrx/signalr/createHub',
    props<{ hubName: string, url?: string, useSharedConnection?: boolean }>()
);
```

`startSignalRHub` will start the hub connection so you can send and receive events.

```ts
const startSignalRHub = createAction(
    '@ngrx/signalr/startHub',
    props<{ hubName: string, url?: string, options?: SignalR.ConnectionOptions }>()
);
```

`stopSignalRHub` will stop the hub connection.

```ts
export const stopSignalRHub = createAction(
    '@ngrx/signalr/stopHub',
    props<{hubName: string, url?: string, async?: boolean, notifyServer?: boolean}>()
)
```

`hubNotFound` can be used when you do retrieve your SignalR hub based on its name and url.

```ts
export const hubNotFound = createAction(
    '@ngrx/signalr/hubNotFound',
    props<{ hubName: string, url: string }>()
);
```

</details>

<details>
<summary>Effects</summary>
<br>

```ts
// create hub automatically
createHub$;
```

```ts
// listen to start result (success/fail)
// listen to change connection state (connecting, connected, disconnected, reconnecting)
// listen to hub error
beforeStartHub$;
```

```ts
// start hub automatically
startHub$;
```
```ts
// stop hub 
stopHub$;
```

</details>

<details>
<summary>Selectors</summary>
<br>

```ts
// used to select all hub statuses in state
const hubStatuses$ = store.pipe(
    select(selectHubsStatuses)
);

// used to select a single hub status based on its name and url
const hubStatus$ = store.pipe(
    select(selectHubStatus, { hubName, url })
);

// used to know if all hubs are connected
const areAllHubsConnected$ = store.pipe(
    select(selectAreAllHubsConnected)
);

// used to know when a hub is in a particular state
const hasHubState$ = store.pipe(
    select(selectHasHubState, { hubName, url, state })
);
```

</details>