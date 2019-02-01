import { Store } from "@ngrx/store";
import { Actions } from "@ngrx/effects";
import { StoreSignalRConfig } from "./module";
export declare class SignalREffects {
    private actions$;
    private store;
    private config;
    private stateKey;
    hubUnstartedWhenCreated$: import("rxjs").Observable<{
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
    constructor(actions$: Actions, store: Store<any>, config: StoreSignalRConfig);
}
