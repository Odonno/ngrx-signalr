import { Observable } from "rxjs";

/**
 * SignalR Hub instance that is built on top of @aspnet/signalr.
 */
export interface ISignalRHub {
    /**
     * Name of the hub.
     */
    hubName: string;
    /**
     * Url of the hub.
     */
    url?: string;
    /**
     * Configuration options of the hub.
     */
    options?: SignalR.ConnectionOptions;

    /**
     * Observable that gives info when a start event occured.
     */
    start$: Observable<void>;
    /**
     * Observable that gives info when a stop event occured.
     */
    stop$: Observable<void>;
    /**
     * Observable that gives info when a state changed event occured.
     */
    state$: Observable<string>;
    /**
     * Observable that gives info when an error occured.
     */
    error$: Observable<SignalR.ConnectionError>;

    /**
     * Start the SignalR hub connection.
     * @param options Configuration options of the hub.
     */
    start(options?: SignalR.ConnectionOptions): Observable<void>;
    /**
     * Stop the SignalR hub connection.
     * @param async Whether or not to asynchronously abort the connection.
     * @param notifyServer Whether we want to notify the server that we are aborting the connection.
     */
    stop(async?: boolean, notifyServer?: boolean): Observable<void>;
    /**
     * Start to listen to a SignalR event from the server.
     * @param eventName Name of the event to listen.
     */
    on<T>(eventName: string): Observable<T>;
    /**
     * Call a function from the client to the server. 
     * @param methodName Name of the event to execute.
     * @param args Arguments to pass to the event function (the hub function).
     */
    send(methodName: string, ...args: any[]): Observable<any>;
    /**
     * Indicates if there is at least one subscription living between the client and the server.
     */
    hasSubscriptions(): boolean;
}