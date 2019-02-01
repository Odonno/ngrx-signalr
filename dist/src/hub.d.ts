import 'signalr';
import { Observable } from 'rxjs';
export interface SignalRError extends Error {
    context?: any;
    transport?: string;
    source?: string;
}
export declare class SignalRHub {
    hubName: string;
    url: string | undefined;
    private _connection;
    private _proxy;
    private _startSubject;
    private _stateSubject;
    private _errorSubject;
    private _subjects;
    start$: Observable<void>;
    state$: Observable<string>;
    error$: Observable<SignalRError>;
    constructor(hubName: string, url: string | undefined);
    start(): Observable<void>;
    on<T>(event: string): Observable<T>;
    send(method: string, ...args: any[]): Observable<any>;
    hasSubscriptions(): boolean;
}
export declare const findHub: (hubName: string, url: string | undefined) => SignalRHub | undefined;
export declare const createHub: (hubName: string, url: string | undefined) => SignalRHub;
