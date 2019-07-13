import 'signalr';
import { createAction, props, union } from '@ngrx/store';

export const createSignalRHub = createAction(
    '@ngrx/signalr/createHub',
    props<{ hubName: string, url?: string | undefined }>()
);

export const SIGNALR_HUB_UNSTARTED = '@ngrx/signalr/hubUnstarted';
export const signalrHubUnstarted = createAction(
    SIGNALR_HUB_UNSTARTED,
    props<{ hubName: string, url?: string | undefined }>()
);

export const startSignalRHub = createAction(
    '@ngrx/signalr/startHub',
    props<{ hubName: string, url?: string | undefined, options?: SignalR.ConnectionOptions | undefined }>()
);

export const SIGNALR_HUB_FAILED_TO_START = '@ngrx/signalr/hubFailedToStart';
export const signalrHubFailedToStart = createAction(
    SIGNALR_HUB_FAILED_TO_START,
    props<{ hubName: string, url?: string | undefined, error: any }>()
);

export const SIGNALR_CONNECTING = '@ngrx/signalr/connecting';
export const signalrConnecting = createAction(
    SIGNALR_CONNECTING,
    props<{ hubName: string, url?: string | undefined }>()
);

export const SIGNALR_CONNECTED = '@ngrx/signalr/connected';
export const signalrConnected = createAction(
    SIGNALR_CONNECTED,
    props<{ hubName: string, url?: string | undefined }>()
);

export const SIGNALR_DISCONNECTED = '@ngrx/signalr/disconnected';
export const signalrDisconnected = createAction(
    SIGNALR_DISCONNECTED,
    props<{ hubName: string, url?: string | undefined }>()
);

export const SIGNALR_RECONNECTING = '@ngrx/signalr/reconnecting';
export const signalrReconnecting = createAction(
    SIGNALR_RECONNECTING,
    props<{ hubName: string, url?: string | undefined }>()
);

export const SIGNALR_ERROR = '@ngrx/signalr/error';
export const signalrError = createAction(
    SIGNALR_ERROR,
    props<{ hubName: string, url?: string | undefined, error: SignalR.ConnectionError }>()
);

export const hubNotFound = createAction(
    '@ngrx/signalr/hubNotFound',
    props<{ hubName: string, url?: string | undefined }>()
);

const signalRAction = union({
    createSignalRHub,
    signalrHubUnstarted,
    startSignalRHub,
    signalrHubFailedToStart,
    signalrConnecting,
    signalrConnected,
    signalrDisconnected,
    signalrReconnecting,
    signalrError,
    hubNotFound
});
export type SignalRAction = typeof signalRAction;