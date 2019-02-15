import { Actions } from "@ngrx/effects";
import { MonoTypeOperatorFunction } from "rxjs";
import { SignalRStartHubAction } from "./actions";
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
        type: string;
        hubName: string;
        url: string | undefined;
    }>;
    beforeStartHub$: import("rxjs").Observable<{
        type: string;
        hubName: string;
        url: string | undefined;
        error: any;
    } | {
        type: string;
        hubName: string;
        url: string | undefined;
    } | {
        type: string;
        hubName: string;
        url: string | undefined;
        error: import("./hub").SignalRError;
    } | undefined>;
    startHub$: import("rxjs").Observable<SignalRStartHubAction>;
    constructor(actions$: Actions);
}
export {};
