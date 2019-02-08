import { InjectionToken } from '@angular/core';
import { Selector } from '@ngrx/store';
import { BaseSignalRStoreState } from './reducer';
export declare type StateKeyOrSelector = string | Selector<any, BaseSignalRStoreState>;
export declare const SIGNALR_CONFIG: InjectionToken<{}>;
export declare const DEFAULT_SIGNALR_FEATURENAME = "signalr";
export declare class StoreSignalRConnectionModule {
    static forRoot(): {
        ngModule: typeof StoreSignalRConnectionModule;
        providers: never[];
    };
    constructor();
}
