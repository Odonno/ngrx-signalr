import 'signalr';
import { Observable } from 'rxjs';
export interface ISignalRHub {
    hubName: string;
    url?: string;
    options?: SignalR.ConnectionOptions;
    start$: Observable<void>;
    state$: Observable<string>;
    error$: Observable<SignalR.ConnectionError>;
    start(options?: SignalR.ConnectionOptions | undefined): Observable<void>;
    on<T>(eventName: string): Observable<T>;
    send(methodName: string, ...args: any[]): Observable<any>;
    hasSubscriptions(): boolean;
}
export declare class SignalRHub implements ISignalRHub {
    hubName: string;
    url?: string | undefined;
    private _connection;
    private _proxy;
    private _startSubject;
    private _stateSubject;
    private _errorSubject;
    private _subjects;
    start$: Observable<void>;
    state$: Observable<string>;
    error$: Observable<SignalR.ConnectionError>;
    options?: SignalR.ConnectionOptions;
    constructor(hubName: string, url?: string | undefined);
    start(options?: SignalR.ConnectionOptions): Observable<void>;
    on<T>(event: string): Observable<T>;
    send(method: string, ...args: any[]): Observable<any>;
    hasSubscriptions(): boolean;
}
export declare abstract class SignalRTestingHub implements ISignalRHub {
    hubName: string;
    url?: string | undefined;
    private _startSubject;
    private _stateSubject;
    private _errorSubject;
    private _subjects;
    start$: Observable<void>;
    state$: Observable<string>;
    error$: Observable<SignalR.ConnectionError>;
    options?: SignalR.ConnectionOptions;
    constructor(hubName: string, url?: string | undefined);
    start(): Observable<void>;
    abstract on<T>(eventName: string): Observable<T>;
    abstract send(methodName: string, ...args: any[]): Observable<any>;
    hasSubscriptions(): boolean;
}
export declare function findHub(hubName: string, url?: string | undefined): ISignalRHub | undefined;
export declare function findHub({ hubName, url }: {
    hubName: string;
    url?: string | undefined;
}): ISignalRHub | undefined;
export declare const createHub: (hubName: string, url?: string | undefined) => ISignalRHub | undefined;
