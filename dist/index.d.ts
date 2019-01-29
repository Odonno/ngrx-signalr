import 'signalr';
import { Observable } from 'rxjs';
interface SignalRError extends Error {
    context?: any;
    transport?: string;
    source?: string;
}
declare const SignalRState: {
    connecting: string;
    connected: string;
    disconnected: string;
    reconnecting: string;
};
declare class SignalRHub {
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
    start(): void;
    on<T>(event: string): Observable<T>;
    send(method: string, ...args: any[]): Promise<any>;
    hasSubscriptions(): boolean;
}
declare const createSignalRHub: (hubName: string, url?: string | undefined) => SignalRHub;
export { SignalRError, SignalRState, createSignalRHub };
