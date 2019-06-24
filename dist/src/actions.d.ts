import 'signalr';
export declare const createSignalRHub: import("@ngrx/store").ActionCreator<"@ngrx/signalr/createHub", (props: {
    hubName: string;
    url?: string | undefined;
}) => {
    hubName: string;
    url?: string | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/createHub">>;
export declare const SIGNALR_HUB_UNSTARTED = "@ngrx/signalr/hubUnstarted";
export declare const signalrHubUnstarted: import("@ngrx/store").ActionCreator<"@ngrx/signalr/hubUnstarted", (props: {
    hubName: string;
    url: string | undefined;
}) => {
    hubName: string;
    url: string | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubUnstarted">>;
export declare const startSignalRHub: import("@ngrx/store").ActionCreator<"@ngrx/signalr/startHub", (props: {
    hubName: string;
    url?: string | undefined;
    options?: SignalR.ConnectionOptions | undefined;
}) => {
    hubName: string;
    url?: string | undefined;
    options?: SignalR.ConnectionOptions | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/startHub">>;
export declare const SIGNALR_HUB_FAILED_TO_START = "@ngrx/signalr/hubFailedToStart";
export declare const signalrHubFailedToStart: import("@ngrx/store").ActionCreator<"@ngrx/signalr/hubFailedToStart", (props: {
    hubName: string;
    url: string | undefined;
    error: any;
}) => {
    hubName: string;
    url: string | undefined;
    error: any;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubFailedToStart">>;
export declare const SIGNALR_CONNECTING = "@ngrx/signalr/connecting";
export declare const signalrConnecting: import("@ngrx/store").ActionCreator<"@ngrx/signalr/connecting", (props: {
    hubName: string;
    url: string | undefined;
}) => {
    hubName: string;
    url: string | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/connecting">>;
export declare const SIGNALR_CONNECTED = "@ngrx/signalr/connected";
export declare const signalrConnected: import("@ngrx/store").ActionCreator<"@ngrx/signalr/connected", (props: {
    hubName: string;
    url: string | undefined;
}) => {
    hubName: string;
    url: string | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/connected">>;
export declare const SIGNALR_DISCONNECTED = "@ngrx/signalr/disconnected";
export declare const signalrDisconnected: import("@ngrx/store").ActionCreator<"@ngrx/signalr/disconnected", (props: {
    hubName: string;
    url: string | undefined;
}) => {
    hubName: string;
    url: string | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/disconnected">>;
export declare const SIGNALR_RECONNECTING = "@ngrx/signalr/reconnecting";
export declare const signalrReconnecting: import("@ngrx/store").ActionCreator<"@ngrx/signalr/reconnecting", (props: {
    hubName: string;
    url: string | undefined;
}) => {
    hubName: string;
    url: string | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/reconnecting">>;
export declare const SIGNALR_ERROR = "@ngrx/signalr/error";
export declare const signalrError: import("@ngrx/store").ActionCreator<"@ngrx/signalr/error", (props: {
    hubName: string;
    url: string | undefined;
    error: SignalR.ConnectionError;
}) => {
    hubName: string;
    url: string | undefined;
    error: SignalR.ConnectionError;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/error">>;
declare const signalRAction: ({
    hubName: string;
    url?: string | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/createHub">) | ({
    hubName: string;
    url: string | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubUnstarted">) | ({
    hubName: string;
    url?: string | undefined;
    options?: SignalR.ConnectionOptions | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/startHub">) | ({
    hubName: string;
    url: string | undefined;
    error: any;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubFailedToStart">) | ({
    hubName: string;
    url: string | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/connecting">) | ({
    hubName: string;
    url: string | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/connected">) | ({
    hubName: string;
    url: string | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/disconnected">) | ({
    hubName: string;
    url: string | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/reconnecting">) | ({
    hubName: string;
    url: string | undefined;
    error: SignalR.ConnectionError;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/error">);
export declare type SignalRAction = typeof signalRAction;
export {};
