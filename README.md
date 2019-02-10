# ngrx-signalr

A library to handle realtime SignalR events using angular, rxjs and the @ngrx library.

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

### Start with a single Hub

TODO

### Using multiple Hubs

TODO

## Features

### SignalR Hub

TODO

### State

TODO

### Actions

TODO

### Effects

TODO

### Selectors

TODO

## Publish a new version

First compile using `tsc` and then publish to npm registry.

```
tsc
npm publish --access public
```