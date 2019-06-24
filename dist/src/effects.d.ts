/// <reference types="signalr" />
import { Actions } from "@ngrx/effects";
import { MonoTypeOperatorFunction } from "rxjs";
import { Action } from "@ngrx/store";
interface HubAction extends Action {
    hubName: string;
    url: string;
}
export declare function ofHub(hubName: string, url?: string | undefined): MonoTypeOperatorFunction<HubAction>;
export declare function ofHub({ hubName, url }: {
    hubName: string;
    url?: string | undefined;
}): MonoTypeOperatorFunction<HubAction>;
export declare class SignalREffects {
    private actions$;
    createHub$: import("rxjs").Observable<{
        hubName: string;
        url: string | undefined;
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubUnstarted">>;
    beforeStartHub$: import("rxjs").Observable<({
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
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/error">)>;
    startHub$: import("rxjs").Observable<{
        hubName: string;
        url?: string | undefined;
        options?: SignalR.ConnectionOptions | undefined;
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/startHub">>;
    constructor(actions$: Actions);
}
export {};
