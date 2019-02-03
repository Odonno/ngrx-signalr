var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StoreSignalRConnectionModule_1;
import { NgModule, InjectionToken } from '@angular/core';
const _SIGNALR_CONFIG = new InjectionToken('@ngrx/signalr Internal Configuration');
export const SIGNALR_CONFIG = new InjectionToken('@ngrx/signalr Configuration');
export const DEFAULT_SIGNALR_FEATURENAME = 'signalr';
const _createSignalrConfig = (config) => {
    return Object.assign({ stateKey: DEFAULT_SIGNALR_FEATURENAME }, config);
};
let StoreSignalRConnectionModule = StoreSignalRConnectionModule_1 = class StoreSignalRConnectionModule {
    constructor() { }
    static forRoot(config = {}) {
        return {
            ngModule: StoreSignalRConnectionModule_1,
            providers: [
                { provide: _SIGNALR_CONFIG, useValue: config }
            ]
        };
    }
};
StoreSignalRConnectionModule = StoreSignalRConnectionModule_1 = __decorate([
    NgModule({
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
    }),
    __metadata("design:paramtypes", [])
], StoreSignalRConnectionModule);
export { StoreSignalRConnectionModule };
