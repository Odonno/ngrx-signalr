import 'signalr';
import { Observable, Subject, from, throwError } from 'rxjs';

export interface SignalRError extends Error {
    context?: any;
    transport?: string;
    source?: string;
}

// TODO : use ngrx actions instead
const connecting = 'connecting';
const connected = 'connected';
const disconnected = 'disconnected';
const reconnecting = 'reconnecting';

export const SignalRState = {
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

const getOrCreateSubject = <T>(subjects: { [name: string]: Subject<any> }, event: string): Subject<T> => {
    return subjects[event] || (subjects[event] = new Subject<T>());
}

const createConnection = (url: string | undefined, errorSubject: Subject<SignalRError>, stateSubject: Subject<string>): { connection?: SignalR.Hub.Connection, error?: Error } => {
    if (!$) {
        return { error: new Error('jQuery is not defined.') }
    }
    if (!$.hubConnection) {
        return { error: new Error('The $.hubConnection function is not defined. Please check if you imported SignalR correctly.') }
    }

    const connection = $.hubConnection(url);

    if (!connection) {
        return { error: new Error("Impossible to create the hub '" + url + "'.") }
    }

    connection.error((error: SignalR.ConnectionError) =>
        errorSubject.next(error)
    );
    connection.stateChanged((state: SignalR.StateChanged) =>
        stateSubject.next(toSignalRState(state.newState))
    );

    return { connection };
}

// TODO : should create an immutable object (with only props: hubName, url and state) = SignalRHubStatus
export class SignalRHub {
    private _connection: SignalR.Hub.Connection | undefined;
    private _proxy: SignalR.Hub.Proxy | undefined;
    private _startSubject = new Subject<void>(); // TODO : use ngrx actions instead
    private _stateSubject = new Subject<string>(); // TODO : use ngrx actions instead
    private _errorSubject = new Subject<SignalRError>(); // TODO : use ngrx actions instead
    private _subjects: { [name: string]: Subject<any> } = {};

    start$: Observable<void>;
    state$: Observable<string>;
    error$: Observable<SignalRError>;

    constructor(public hubName: string, public url: string | undefined) {
        this.start$ = this._startSubject.asObservable();
        this.state$ = this._stateSubject.asObservable();
        this.error$ = this._errorSubject.asObservable();
    }

    // TODO : return an observable
    start() {
        if (!this._connection) {
            const { connection, error } = createConnection(this.url, this._errorSubject, this._stateSubject);
            if (error) {
                this._startSubject.error(error);
                return;
            }

            this._connection = connection;
        }

        if (!this._connection) {
            this._startSubject.error(new Error('Impossible to start the connection...'));
            return;
        }

        if (!this.hasSubscriptions()) {
            console.warn('No listeners have been setup. You need to setup a listener before starting the connection or you will not receive data.');
        }

        this._connection.start()
            .done(_ => this._startSubject.next())
            .fail((error) => this._startSubject.error(error));
    }

    on<T>(event: string): Observable<T> {
        if (!this._connection) {
            console.warn('The connection has not been started yet. Please start the connection by invoking the start method before attempting to listen to event type ' + event + '.');
            return new Observable<T>();
        }

        if (!this._proxy) {
            this._proxy = this._connection.createHubProxy(this.hubName);
        }

        const subject = getOrCreateSubject<T>(this._subjects, event);
        this._proxy.on(event, (data: T) => subject.next(data));

        return subject.asObservable();
    }

    send(method: string, ...args: any[]): Observable<any> {
        if (!this._connection) {
            return throwError('The connection has not been started yet. Please start the connection by invoking the start method before attempting to send a message to the server.');
        }

        if (!this._proxy) {
            this._proxy = this._connection.createHubProxy(this.hubName);
        }

        return from(this._proxy.invoke(method, ...args));
    }

    hasSubscriptions(): boolean {
        for (let key in this._subjects) {
            if (this._subjects.hasOwnProperty(key)) {
                return true;
            }
        }

        return false;
    }
}

// TODO : use the hubs in the ngrx store
const hubs: SignalRHub[] = [];

// TODO : use a ngrx selector instead
export const findHub = (hubName: string, url: string | undefined): SignalRHub | undefined => {
    return hubs.filter(h => h.hubName === hubName && h.url === url)[0];
}

const addHub = (hubName: string, url: string | undefined): SignalRHub => {
    const hub = new SignalRHub(hubName, url);
    hubs.push(hub);
    return hub;
}

// TODO : dispatch an action
export const createSignalRHub = (hubName: string, url?: string | undefined): SignalRHub => {
    return findHub(hubName, url) || addHub(hubName, url);
}