/// <reference types="signalr" />
import { Actions } from "@ngrx/effects";
import { Action } from "@ngrx/store";
export declare class SignalREffects {
    private actions$;
    createHub$: import("rxjs").Observable<{
        hubName: string;
        url?: string | undefined;
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubUnstarted">>;
    beforeStartHub$: import("rxjs").Observable<({
        hubName: string;
        url?: string | undefined;
        error: any;
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubFailedToStart">) | ({
        hubName: string;
        url?: string | undefined;
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/connecting">) | ({
        hubName: string;
        url?: string | undefined;
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/connected">) | ({
        hubName: string;
        url?: string | undefined;
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/disconnected">) | ({
        hubName: string;
        url?: string | undefined;
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/reconnecting">) | ({
        hubName: string;
        url?: string | undefined;
        error: SignalR.ConnectionError;
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/error">)>;
    startHub$: import("rxjs").Observable<{
        hubName: string;
        url?: string | undefined;
        options?: SignalR.ConnectionOptions | undefined;
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/startHub">>;
    constructor(actions$: Actions);
}
export declare const createReconnectEffect: (actions$: Actions<Action>, intervalTimespan: number) => import("rxjs").Observable<({
    hubName: string;
    url?: string | undefined;
    options?: SignalR.ConnectionOptions | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/startHub">) | ({
    hubName: string;
    url?: string | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubNotFound">)>;
