import { Actions } from "@ngrx/effects";
export declare class SignalREffects {
    private actions$;
    createHub$: import("rxjs").Observable<{
        type: string;
        hubName: string;
        url: string | undefined;
    }>;
    startHub$: import("rxjs").Observable<{
        type: string;
        hubName: string;
        url: string | undefined;
    } | {
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
    constructor(actions$: Actions);
}
