import 'signalr';

export const SIGNALR_CONNECTION_SUCCEED = '@ngrx/signalr/connectionSucceed';
export type SignalRConnectionSucceedAction = {
    type: typeof SIGNALR_CONNECTION_SUCCEED;
    hubName: string;
    url: string | undefined;
};

export const SIGNALR_CONNECTION_FAILED = '@ngrx/signalr/connectionFailed';
export type SignalRConnectionFailedAction = {
    type: typeof SIGNALR_CONNECTION_FAILED;
    hubName: string;
    url: string | undefined;
    error: any;
};

export const SIGNALR_CONNECTING = '@ngrx/signalr/connecting';
export type SignalRConnectingAction = {
    type: typeof SIGNALR_CONNECTING;
    hubName: string;
    url: string | undefined;
};

export const SIGNALR_CONNECTED = '@ngrx/signalr/connected';
export type SignalRConnectedAction = {
    type: typeof SIGNALR_CONNECTED;
    hubName: string;
    url: string | undefined;
};

export const SIGNALR_DISCONNECTED = '@ngrx/signalr/disconnected';
export type SignalRDisconnectedAction = {
    type: typeof SIGNALR_DISCONNECTED;
    hubName: string;
    url: string | undefined;
};

export const SIGNALR_RECONNECTING = '@ngrx/signalr/reconnecting';
export type SignalRReconnectingAction = {
    type: typeof SIGNALR_RECONNECTING;
    hubName: string;
    url: string | undefined;
};

export const SIGNALR_ERROR = '@ngrx/signalr/error';
export type SignalRErrorAction = {
    type: typeof SIGNALR_ERROR;
    hubName: string;
    url: string | undefined;
    error: SignalR.ConnectionError;
};

export type SignalRAction =
    | SignalRConnectionSucceedAction
    | SignalRConnectionFailedAction
    | SignalRConnectingAction
    | SignalRConnectedAction
    | SignalRDisconnectedAction
    | SignalRReconnectingAction
    | SignalRErrorAction;