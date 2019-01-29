import 'signalr';
import { Observable, Subject } from 'rxjs';

// TODO : create ngrx action for connection error
interface SignalRError extends Error {
    context?: any;
    transport?: string;
    source?: string;
}

// TODO : create ngrx actions for connection state
const connecting = 'connecting';
const connected = 'connected';
const disconnected = 'disconnected';
const reconnecting = 'reconnecting';

const SignalRState = {
    connecting,
    connected,
    disconnected,
    reconnecting
}

const toSignalRState = (state: SignalR.ConnectionState): string => {
    switch (state) {
        case SignalR.ConnectionState.Connecting:
            return connecting;
        case SignalR.ConnectionState.Connected:
            return connected;
        case SignalR.ConnectionState.Disconnected:
            return disconnected;
        case SignalR.ConnectionState.Reconnecting:
            return reconnecting;
    }
}

class SignalRHub {
    private _connection: SignalR.Hub.Connection | undefined;
    private _proxy: SignalR.Hub.Proxy | undefined;
    private _start$: Subject<any>;
    private _state$: Subject<string>;
    private _error$: Subject<SignalRError>;
    private _subjects: { [name: string]: Subject<any> };
    private _primePromise: JQueryPromise<any> | undefined;

    get connection(): SignalR.Hub.Connection {
        return this._connection || (this._connection = this.createConnection());
    }

    get proxy(): SignalR.Hub.Proxy {
        return this._proxy || (this._proxy = this.connection.createHubProxy(this.hubName));
    }

    get hubName(): string {
        return this._hubName;
    }

    get url(): string | undefined {
        return this._url;
    }

    get start$(): Observable<void> {
        return this._start$.asObservable();
    }

    get state$(): Observable<string> {
        return this._state$.asObservable();
    }

    get error$(): Observable<SignalRError> {
        return this._error$.asObservable();
    }

    constructor(private _hubName: string, private _url: string | undefined) {
        this._subjects = {};
        this._start$ = new Subject<void>();
        this._state$ = new Subject<string>();
        this._error$ = new Subject<SignalRError>();
    }

    start() {
        if (!this.hasSubscriptions()) {
            console.warn('No listeners have been setup. You need to setup a listener before starting the connection or you will not receive data.');
        }

        this.connection.start()
            .done(_ => this._start$.next())
            .fail((error) => this._start$.error(error))
    }

    on<T>(event: string): Observable<T> {
        const subject = this.getOrCreateSubject<T>(event);
        this.proxy.on(event, (data: T) => subject.next(data))
        return subject.asObservable();
    }

    async send(method: string, ...args: any[]): Promise<any> {
        if (!this._primePromise) {
            return Promise.reject('The connection has not been started yet. Please start the connection by invoking the start method befor attempting to send a message to the server.');
        }
        await this._primePromise;
        return this.proxy.invoke(method, ...args);
    }

    hasSubscriptions(): boolean {
        for (let key in this._subjects) {
            if (this._subjects.hasOwnProperty(key)) {
                return true;
            }
        }

        return false;
    }

    private getOrCreateSubject<T>(event: string): Subject<T> {
        return this._subjects[event] || (this._subjects[event] = new Subject<T>());
    }

    private createConnection(): SignalR.Hub.Connection {
        const connection = $.hubConnection(this._url);

        connection.error((error: SignalR.ConnectionError) =>
            this._error$.next(error)
        );
        connection.stateChanged((state: SignalR.StateChanged) =>
            this._state$.next(toSignalRState(state.newState))
        );

        return connection;
    }
}

const hubs: SignalRHub[] = [];

const getHub = (hubName: string, url: string | undefined): SignalRHub | undefined => {
    return hubs.filter(h => h.hubName === hubName && h.url === url)[0];
}

const addHub = (hubName: string, url: string | undefined): SignalRHub => {
    const hub = new SignalRHub(hubName, url);
    hubs.push(hub);
    return hub;
}

const createSignalRHub = (hubName: string, url?: string | undefined): SignalRHub => {
    return getHub(hubName, url) || addHub(hubName, url);
}

export { SignalRError, SignalRState, createSignalRHub }; 