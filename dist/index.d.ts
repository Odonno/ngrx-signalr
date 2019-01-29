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
    private _hubName;
    private _url;
    private _connection;
    private _proxy;
    private _start$;
    private _state$;
    private _error$;
    private _subjects;
    private _primePromise;
    readonly connection: SignalR.Hub.Connection;
    readonly proxy: SignalR.Hub.Proxy;
    readonly hubName: string;
    readonly url: string | undefined;
    readonly start$: Observable<void>;
    readonly state$: Observable<string>;
    readonly error$: Observable<SignalRError>;
    constructor(_hubName: string, _url: string | undefined);
    start(): void;
    on<T>(event: string): Observable<T>;
    send(method: string, ...args: any[]): Promise<any>;
    hasSubscriptions(): boolean;
    private getOrCreateSubject;
    private createConnection;
}
declare const createSignalRHub: (hubName: string, url?: string | undefined) => SignalRHub;
export { SignalRError, SignalRState, createSignalRHub };
