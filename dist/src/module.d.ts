import { InjectionToken } from '@angular/core';
import { Selector } from '@ngrx/store';
import { BaseSignalRStoreState } from './reducer';
export declare type StateKeyOrSelector = string | Selector<any, BaseSignalRStoreState>;
export interface StoreSignalRConfig {
    stateKey?: StateKeyOrSelector;
}
export declare const SIGNALR_CONFIG: InjectionToken<{}>;
export declare const DEFAULT_SIGNALR_FEATURENAME = "signalr";
export declare class StoreSignalRConnectionModule {
    static forRoot(config?: StoreSignalRConfig): {
        ngModule: typeof StoreSignalRConnectionModule;
        providers: {
            provide: InjectionToken<{}>;
            useValue: StoreSignalRConfig;
        }[];
    };
    constructor();
}
