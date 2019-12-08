import 'signalr';
import { Observable, Subject, from, throwError, timer } from 'rxjs';
import { toSignalRState } from './hubStatus';
import { hubCreationFunc, testingEnabled } from './testing';

const getOrCreateSubject = <T>(subjects: { [name: string]: Subject<any> }, event: string): Subject<T> => {
    return subjects[event] || (subjects[event] = new Subject<T>());
}

let localCachedConnection: SignalR.Hub.Connection | undefined = undefined;
const cachedConnections: { [url: string]: SignalR.Hub.Connection } = {};

const getOrCreateCachedConnection = (url: string | undefined) => {
    if (url) {
        if (!cachedConnections[url]) {
            cachedConnections[url] = $.hubConnection(url);
        }
    
        return cachedConnections[url];
    }

    if (!localCachedConnection) {
        localCachedConnection = $.hubConnection(url);
    }
    
    return localCachedConnection;
}

const createConnection = (
    url: string | undefined,
    errorSubject: Subject<SignalR.ConnectionError>,
    stateSubject: Subject<string>,
    useSharedConnection: boolean
): { connection?: SignalR.Hub.Connection, error?: Error } => {
    if (!$) {
        return { error: new Error('jQuery is not defined.') }
    }
    if (!$.hubConnection) {
        return { error: new Error('The $.hubConnection function is not defined. Please check if you imported SignalR correctly.') }
    }

    const connection = useSharedConnection
        ? getOrCreateCachedConnection(url)
        : $.hubConnection(url);

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

export interface ISignalRHub {
    hubName: string;
    url?: string;
    options?: SignalR.ConnectionOptions;

    start$: Observable<void>;
    state$: Observable<string>;
    error$: Observable<SignalR.ConnectionError>;
    
    start(options?: SignalR.ConnectionOptions): Observable<void>;
    stop(async?: boolean, notifyServer?: boolean): Observable<void>;
    on<T>(eventName: string): Observable<T>;
    send(methodName: string, ...args: any[]): Observable<any>;
    hasSubscriptions(): boolean;
}

export class SignalRHub implements ISignalRHub {
    private _connection: SignalR.Hub.Connection | undefined;
    private _proxy: SignalR.Hub.Proxy | undefined;
    private _startSubject = new Subject<void>();
    private _stopSubject = new Subject<void>();
    private _stateSubject = new Subject<string>();
    private _errorSubject = new Subject<SignalR.ConnectionError>();
    private _subjects: { [name: string]: Subject<any> } = {};

    start$: Observable<void>;
    stop$: Observable<void>;
    state$: Observable<string>;
    error$: Observable<SignalR.ConnectionError>;

    options?: SignalR.ConnectionOptions;

    constructor(public hubName: string, public url?: string, public useSharedConnection: boolean = true) {
        this.start$ = this._startSubject.asObservable();
        this.stop$ = this._stopSubject.asObservable();
        this.state$ = this._stateSubject.asObservable();
        this.error$ = this._errorSubject.asObservable();
    }

    stop(async?: boolean, notifyServer?: boolean): Observable<void> {
        setTimeout(() => {
            if (this._connection) {
                try {
                    this._connection.stop(async, notifyServer);
                    this._stopSubject.next();
                } catch (error) {
                    this._stopSubject.error(error);
                }
            }
        }, 0);
        return this._stopSubject.asObservable();
    }

    start(options?: SignalR.ConnectionOptions): Observable<void> {
        if (!this._connection) {
            const { connection, error } = createConnection(this.url, this._errorSubject, this._stateSubject, this.useSharedConnection);
            if (error) {
                this._startSubject.error(error);
                return throwError(error);
            }

            this._connection = connection;

            if (!this._connection) {
                const error = new Error('Impossible to start the connection...');

                this._startSubject.error(error);
                return throwError(error);
            }
        }

        if (!this.hasSubscriptions()) {
            console.warn('No listeners have been setup. You need to setup a listener before starting the connection or you will not receive data.');
        }

        this.options = options;

        if (options) {
            this._connection.start(options)
                .done(_ => this._startSubject.next())
                .fail((error) => this._startSubject.error(error));
        } else {
            this._connection.start()
                .done(_ => this._startSubject.next())
                .fail((error) => this._startSubject.error(error));
        }

        return this._startSubject.asObservable();
    }

    on<T>(event: string): Observable<T> {
        if (!this._connection) {
            const { connection, error } = createConnection(this.url, this._errorSubject, this._stateSubject, this.useSharedConnection);
            if (error) {
                this._startSubject.error(error);
                return throwError(error);
            }

            this._connection = connection;

            if (!this._connection) {
                return throwError(new Error('Impossible to listen to the connection...'));
            }
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

export abstract class SignalRTestingHub implements ISignalRHub {
    private _startSubject = new Subject<void>();
    private _stopSubject = new Subject<void>();
    private _stateSubject = new Subject<string>();
    private _errorSubject = new Subject<SignalR.ConnectionError>();
    private _subjects: { [eventName: string]: Subject<any> } = {};

    start$: Observable<void>;

    stop$: Observable<void>;

    state$: Observable<string>;
    error$: Observable<SignalR.ConnectionError>;

    options?: SignalR.ConnectionOptions;

    constructor(public hubName: string, public url?: string) {
        this.start$ = this._startSubject.asObservable();
        this.stop$ = this._startSubject.asObservable();
        this.state$ = this._stateSubject.asObservable();
        this.error$ = this._errorSubject.asObservable();
    }

    start(): Observable<void> {
        timer(100).subscribe(_ => {
            this._startSubject.next();
            this._stateSubject.next('connected');
        });

        return this._startSubject.asObservable();
    }

    stop(async?: boolean, notifyServer?: boolean): Observable<void> {
        timer(100).subscribe(_ => {
            this._stopSubject.next();
        });

        return this._startSubject.asObservable();
    }

    abstract on<T>(eventName: string): Observable<T>;

    abstract send(methodName: string, ...args: any[]): Observable<any>;

    hasSubscriptions(): boolean {
        for (let key in this._subjects) {
            if (this._subjects.hasOwnProperty(key)) {
                return true;
            }
        }

        return false;
    }
}

const hubs: ISignalRHub[] = [];

export function findHub(hubName: string, url?: string): ISignalRHub | undefined;
export function findHub({ hubName, url }: { hubName: string, url?: string }): ISignalRHub | undefined;
export function findHub(x: string | { hubName: string, url?: string }, url?: string): ISignalRHub | undefined {
    if (typeof x === 'string') {
        return hubs.filter(h => h.hubName === x && h.url === url)[0];
    }
    return hubs.filter(h => h.hubName === x.hubName && h.url === x.url)[0];
};

export const createHub = (hubName: string, url?: string, useSharedConnection?: boolean): ISignalRHub | undefined => {
    if (testingEnabled) {
        const hub = hubCreationFunc(hubName, url);
        if (hub) {
            hubs.push(hub);
            return hub;
        }
        return undefined;
    }

    const hub = new SignalRHub(hubName, url, useSharedConnection || true);
    hubs.push(hub);
    return hub;
}