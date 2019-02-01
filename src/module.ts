import { NgModule, InjectionToken } from '@angular/core';
import { Selector } from '@ngrx/store';

import { BaseSignalRStoreState } from './reducer';

export type StateKeyOrSelector =
    string | Selector<any, BaseSignalRStoreState>;

export interface StoreSignalRConfig {
    stateKey?: StateKeyOrSelector;
}

const _SIGNALR_CONFIG = new InjectionToken(
    '@ngrx/signalr Internal Configuration'
);
export const SIGNALR_CONFIG = new InjectionToken(
    '@ngrx/signalr Configuration'
);
export const DEFAULT_SIGNALR_FEATURENAME = 'signalr';

const _createSignalrConfig = (config: StoreSignalRConfig): StoreSignalRConfig => {
    return {
        stateKey: DEFAULT_SIGNALR_FEATURENAME,
        ...config
    };
}

@NgModule({
    providers: [
        {
            provide: _SIGNALR_CONFIG,
            useValue: {}
        },
        {
            provide: SIGNALR_CONFIG,
            useFactory: _createSignalrConfig,
            deps: [_SIGNALR_CONFIG]
        }
    ]
})
export class StoreSignalRConnectionModule {
    static forRoot(config: StoreSignalRConfig = {}) {
        return {
            ngModule: StoreSignalRConnectionModule,
            providers: [
                { provide: _SIGNALR_CONFIG, useValue: config }
            ]
        }
    }

    constructor() { }
}