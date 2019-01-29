import 'signalr';
export declare const SIGNALR_CONNECTION_SUCCEED = "@ngrx/signalr/connectionSucceed";
export declare type SignalRConnectionSucceedAction = {
    type: typeof SIGNALR_CONNECTION_SUCCEED;
    hubName: string;
    url: string | undefined;
};
export declare const SIGNALR_CONNECTION_FAILED = "@ngrx/signalr/connectionFailed";
export declare type SignalRConnectionFailedAction = {
    type: typeof SIGNALR_CONNECTION_FAILED;
    hubName: string;
    url: string | undefined;
    error: any;
};
export declare const SIGNALR_CONNECTING = "@ngrx/signalr/connecting";
export declare type SignalRConnectingAction = {
    type: typeof SIGNALR_CONNECTING;
    hubName: string;
    url: string | undefined;
};
export declare const SIGNALR_CONNECTED = "@ngrx/signalr/connected";
export declare type SignalRConnectedAction = {
    type: typeof SIGNALR_CONNECTED;
    hubName: string;
    url: string | undefined;
};
export declare const SIGNALR_DISCONNECTED = "@ngrx/signalr/disconnected";
export declare type SignalRDisconnectedAction = {
    type: typeof SIGNALR_DISCONNECTED;
    hubName: string;
    url: string | undefined;
};
export declare const SIGNALR_RECONNECTING = "@ngrx/signalr/reconnecting";
export declare type SignalRReconnectingAction = {
    type: typeof SIGNALR_RECONNECTING;
    hubName: string;
    url: string | undefined;
};
export declare const SIGNALR_ERROR = "@ngrx/signalr/error";
export declare type SignalRErrorAction = {
    type: typeof SIGNALR_ERROR;
    hubName: string;
    url: string | undefined;
    error: SignalR.ConnectionError;
};
export declare type SignalRAction = SignalRConnectionSucceedAction | SignalRConnectionFailedAction | SignalRConnectingAction | SignalRConnectedAction | SignalRDisconnectedAction | SignalRReconnectingAction | SignalRErrorAction;
