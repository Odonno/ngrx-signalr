import 'signalr';
import { createAction, props, union } from '@ngrx/store';

/**
 * Action to dispatch in order to create a new SignalR hub.
 */
export const createSignalRHub = createAction(
    '@ngrx/signalr/createHub',
    props<{ hubName: string, url?: string, useSharedConnection?: boolean }>()
);

export const SIGNALR_HUB_UNSTARTED = '@ngrx/signalr/hubUnstarted';
/**
 * Action dispatched when a hub is at `unstarted` state.
 */
export const signalrHubUnstarted = createAction(
    SIGNALR_HUB_UNSTARTED,
    props<{ hubName: string, url?: string }>()
);

/**
 * Action to dispatch in order to start a SignalR hub.
 */
export const startSignalRHub = createAction(
    '@ngrx/signalr/startHub',
    props<{ hubName: string, url?: string, options?: SignalR.ConnectionOptions }>()
);

/**
 * Action to dispatch in order to stop a SignalR hub.
 */
export const stopSignalRHub = createAction(
    '@ngrx/signalr/stopHub',
    props<{ hubName: string, url?: string, async?: boolean, notifyServer?: boolean }>()
)

export const SIGNALR_HUB_FAILED_TO_START = '@ngrx/signalr/hubFailedToStart';
/**
 * Action dispatched when a SignalR failed to start.
 */
export const signalrHubFailedToStart = createAction(
    SIGNALR_HUB_FAILED_TO_START,
    props<{ hubName: string, url?: string, error: any }>()
);

export const SIGNALR_CONNECTING = '@ngrx/signalr/connecting';
/**
 * Action dispatched when a hub is at `connecting` state.
 */
export const signalrConnecting = createAction(
    SIGNALR_CONNECTING,
    props<{ hubName: string, url?: string }>()
);

export const SIGNALR_CONNECTED = '@ngrx/signalr/connected';
/**
 * Action dispatched when a hub is at `connected` state.
 */
export const signalrConnected = createAction(
    SIGNALR_CONNECTED,
    props<{ hubName: string, url?: string }>()
);

export const SIGNALR_DISCONNECTED = '@ngrx/signalr/disconnected';
/**
 * Action dispatched when a hub is at `disconnected` state.
 */
export const signalrDisconnected = createAction(
    SIGNALR_DISCONNECTED,
    props<{ hubName: string, url?: string }>()
);

export const SIGNALR_RECONNECTING = '@ngrx/signalr/reconnecting';
/**
 * Action dispatched when a hub is at `reconnecting` state.
 */
export const signalrReconnecting = createAction(
    SIGNALR_RECONNECTING,
    props<{ hubName: string, url?: string }>()
);

export const SIGNALR_ERROR = '@ngrx/signalr/error';
/**
 * Action dispatched when an error occured with a SignalR hub.
 */
export const signalrError = createAction(
    SIGNALR_ERROR,
    props<{ hubName: string, url?: string, error: SignalR.ConnectionError }>()
);

/**
 * Action dispatched when a SignalR cannot be found, when doing any action.
 */
export const hubNotFound = createAction(
    '@ngrx/signalr/hubNotFound',
    props<{ hubName: string, url?: string }>()
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
/**
 * Union of all possible actions to use on the ngrx-signalr package. 
 */
export type SignalRAction = typeof signalRAction;