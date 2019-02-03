import { Actions } from "@ngrx/effects";
import { SignalRStartHubAction } from "./actions";
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
