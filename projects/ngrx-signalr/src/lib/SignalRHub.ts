import { ISignalRHub } from "./SignalRHub.interface";
import { Subject, Observable, throwError, from } from "rxjs";
import { SignalRExtendedConnectionOptions } from "./models";
import { createConnection, getOrCreateSubject } from './signalr';

export class SignalRHub implements ISignalRHub {
    private _connection?: SignalR.Hub.Connection;
    private _proxy?: SignalR.Hub.Proxy;
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
    extendedOptions?: SignalRExtendedConnectionOptions;

    constructor(public hubName: string, public url?: string, public useSharedConnection: boolean = true) {
        this.start$ = this._startSubject.asObservable();
        this.stop$ = this._stopSubject.asObservable();
        this.state$ = this._stateSubject.asObservable();
        this.error$ = this._errorSubject.asObservable();
    }

    start(options?: SignalR.ConnectionOptions, extendedOptions?: SignalRExtendedConnectionOptions): Observable<void> {
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
        this.extendedOptions = extendedOptions;

        if (extendedOptions) {
            if (extendedOptions.qs) {
                this._connection.qs = extendedOptions.qs;
            }
            this._connection.reconnectDelay = extendedOptions.reconnectDelay || 2000;
            this._connection.transportConnectTimeout = extendedOptions.transportConnectTimeout || 0;
        }

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

    stop(async?: boolean, notifyServer?: boolean): Observable<void> {
        setTimeout(() => {
            if (!this._connection) {
                const error = new Error('The connection has not been started yet. Please start the connection by invoking the start method before attempting to stop listening from the server.');

                this._stopSubject.error(error);
                return throwError(error);
            }

            try {
                this._connection.stop(async, notifyServer);
                this._stopSubject.next();
            } catch (error) {
                this._stopSubject.error(error);
            }
        }, 0);

        return this._stopSubject.asObservable();
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
                const error = new Error('Impossible to listen to the connection...');
                return throwError(error);
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
            const error = new Error('The connection has not been started yet. Please start the connection by invoking the start method before attempting to send a message to the server.');
            return throwError(error);
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