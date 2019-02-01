import 'signalr';
import { Observable, Subject, from, throwError } from 'rxjs';

import { toSignalRState } from './hubStatus';

export interface SignalRError extends Error {
    context?: any;
    transport?: string;
    source?: string;
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

export class SignalRHub {
    private _connection: SignalR.Hub.Connection | undefined;
    private _proxy: SignalR.Hub.Proxy | undefined;
    private _startSubject = new Subject<void>();
    private _stateSubject = new Subject<string>();
    private _errorSubject = new Subject<SignalRError>();
    private _subjects: { [name: string]: Subject<any> } = {};

    start$: Observable<void>;
    state$: Observable<string>;
    error$: Observable<SignalRError>;

    constructor(public hubName: string, public url: string | undefined) {
        this.start$ = this._startSubject.asObservable();
        this.state$ = this._stateSubject.asObservable();
        this.error$ = this._errorSubject.asObservable();
    }

    start(): Observable<void> {
        if (!this._connection) {
            const { connection, error } = createConnection(this.url, this._errorSubject, this._stateSubject);
            if (error) {
                this._startSubject.error(error);
                return throwError(error);
            }

            this._connection = connection;
        }

        if (!this._connection) {
            const error = new Error('Impossible to start the connection...');

            this._startSubject.error(error);
            return throwError(error);
        }

        if (!this.hasSubscriptions()) {
            console.warn('No listeners have been setup. You need to setup a listener before starting the connection or you will not receive data.');
        }

        this._connection.start()
            .done(_ => this._startSubject.next())
            .fail((error) => this._startSubject.error(error));

        return this._startSubject.asObservable();
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

const hubs: SignalRHub[] = [];

export function findHub(hubName: string, url?: string | undefined): SignalRHub | undefined;
export function findHub({ hubName, url }: { hubName: string, url?: string | undefined }): SignalRHub | undefined;
export function findHub(x: string | { hubName: string, url?: string | undefined }, url?: string | undefined): SignalRHub | undefined {
    if (typeof x === 'string') {
        return hubs.filter(h => h.hubName === x && h.url === url)[0];
    }
    return hubs.filter(h => h.hubName === x.hubName && h.url === x.url)[0];
};

export const createHub = (hubName: string, url?: string | undefined): SignalRHub => {
    const hub = new SignalRHub(hubName, url);
    hubs.push(hub);
    return hub;
}