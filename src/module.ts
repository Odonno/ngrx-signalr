import { NgModule, InjectionToken } from '@angular/core';
import { Selector } from '@ngrx/store';

import { BaseSignalRStoreState } from './reducer';

export type StateKeyOrSelector =
    string | Selector<any, BaseSignalRStoreState>;

export const SIGNALR_CONFIG = new InjectionToken(
    '@ngrx/signalr Configuration'
);
export const DEFAULT_SIGNALR_FEATURENAME = 'signalr';

@NgModule({
    providers: []
})
export class StoreSignalRConnectionModule {
    static forRoot() {
        return {
            ngModule: StoreSignalRConnectionModule,
            providers: []
        }
    }

    constructor() { }
}