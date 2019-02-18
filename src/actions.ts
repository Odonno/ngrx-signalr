import 'signalr';

export const SIGNALR_CREATE_HUB = '@ngrx/signalr/createHub';
export type SignalRCreateHubAction = {
    type: typeof SIGNALR_CREATE_HUB;
    hubName: string;
    url: string | undefined;
};
export const createSignalRHub = (hubName: string, url?: string | undefined) => 
    ({ type: SIGNALR_CREATE_HUB, hubName, url });

export const SIGNALR_HUB_UNSTARTED = '@ngrx/signalr/hubUnstarted';
export type SignalRHubUnstartedAction = {
    type: typeof SIGNALR_HUB_UNSTARTED;
    hubName: string;
    url: string | undefined;
};

export const SIGNALR_START_HUB = '@ngrx/signalr/startHub';
export type SignalRStartHubAction = {
    type: typeof SIGNALR_START_HUB;
    hubName: string;
    url: string | undefined;
};
export const startSignalRHub = (hubName: string, url?: string | undefined) => 
    ({ type: SIGNALR_START_HUB, hubName, url });

export const SIGNALR_HUB_FAILED_TO_START = '@ngrx/signalr/hubFailedToStart';
export type SignalRHubFailedToStartAction = {
    type: typeof SIGNALR_HUB_FAILED_TO_START;
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
    | SignalRCreateHubAction
    | SignalRStartHubAction
    | SignalRHubUnstartedAction 
    | SignalRHubFailedToStartAction
    | SignalRConnectingAction
    | SignalRConnectedAction
    | SignalRDisconnectedAction
    | SignalRReconnectingAction
    | SignalRErrorAction;