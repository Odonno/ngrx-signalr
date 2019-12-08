import { Observable } from "rxjs";

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