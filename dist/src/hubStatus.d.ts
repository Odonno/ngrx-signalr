/// <reference types="signalr" />
declare const unstarted = "unstarted";
declare const started = "started";
declare const connecting = "connecting";
declare const connected = "connected";
declare const disconnected = "disconnected";
declare const reconnecting = "reconnecting";
export declare const SignalRStates: {
    unstarted: string;
    started: string;
    connecting: string;
    connected: string;
    disconnected: string;
    reconnecting: string;
};
export declare const toSignalRState: (state: SignalR.ConnectionState) => string;
export declare type SignalRHubState = typeof unstarted | typeof started | typeof connecting | typeof connected | typeof disconnected | typeof reconnecting;
export declare type SignalRHubStatus = {
    hubName: string;
    url: string | undefined;
    state: SignalRHubState | undefined;
};
export {};
