"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var _SIGNALR_CONFIG = new core_1.InjectionToken('@ngrx/signalr Internal Configuration');
exports.SIGNALR_CONFIG = new core_1.InjectionToken('@ngrx/signalr Configuration');
exports.DEFAULT_SIGNALR_FEATURENAME = 'signalr';
var _createSignalrConfig = function (config) {
    return __assign({ stateKey: exports.DEFAULT_SIGNALR_FEATURENAME }, config);
};
var StoreSignalRConnectionModule = /** @class */ (function () {
    function StoreSignalRConnectionModule() {
    }
    StoreSignalRConnectionModule_1 = StoreSignalRConnectionModule;
    StoreSignalRConnectionModule.forRoot = function (config) {
        if (config === void 0) { config = {}; }
        return {
            ngModule: StoreSignalRConnectionModule_1,
            providers: [
                { provide: _SIGNALR_CONFIG, useValue: config }
            ]
        };
    };
    var StoreSignalRConnectionModule_1;
    StoreSignalRConnectionModule = StoreSignalRConnectionModule_1 = __decorate([
        core_1.NgModule({
            providers: [
                {
                    provide: _SIGNALR_CONFIG,
                    useValue: {}
                },
                {
                    provide: exports.SIGNALR_CONFIG,
                    useFactory: _createSignalrConfig,
                    deps: [_SIGNALR_CONFIG]
                }
            ]
        })
    ], StoreSignalRConnectionModule);
    return StoreSignalRConnectionModule;
}());
exports.StoreSignalRConnectionModule = StoreSignalRConnectionModule;
