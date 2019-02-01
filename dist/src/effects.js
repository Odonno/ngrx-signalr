"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var effects_1 = require("@ngrx/effects");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var module_1 = require("./module");
var actions_1 = require("./actions");
var SignalREffects = /** @class */ (function () {
    function SignalREffects(actions$, store, config) {
        this.actions$ = actions$;
        this.store = store;
        this.config = config;
        // handle hub creation (hub unstarted by default)
        this.hubUnstartedWhenCreated$ = this.store.select(this.stateKey).pipe(operators_1.pairwise(), operators_1.filter(function (_a) {
            var previousState = _a[0], newState = _a[1];
            return previousState !== newState;
        }), operators_1.map(function (_a) {
            var previousState = _a[0], newState = _a[1];
            return newState.hubs
                .filter(function (hub) { return !previousState.hubs.some(function (h) { return h.hubName === hub.hubName && h.url === hub.url; }); })[0];
        }), operators_1.filter(function (hub) { return !!hub; }), operators_1.map(function (hub) { return ({ type: actions_1.SIGNALR_HUB_UNSTARTED, hubName: hub.hubName, url: hub.url }); }));
        // handle start result (success/fail)
        // handle change connection state (connecting, connected, disconnected, reconnecting)
        // handle hub error
        this.startHub$ = this.actions$.pipe(effects_1.ofType(actions_1.SIGNALR_HUB_UNSTARTED), operators_1.withLatestFrom(this.store.select(this.stateKey).pipe(operators_1.map(function (state) { return state.hubs; }))), operators_1.mergeMap(function (_a) {
            var action = _a[0], hubs = _a[1];
            var hub = hubs.filter(function (h) { return h.hubName === action.hubName && h.url === action.url; })[0];
            var start$ = hub.start$.pipe(operators_1.map(function (_) { return ({ type: actions_1.SIGNALR_HUB_STARTED, hubName: action.hubName, url: action.url }); }), operators_1.catchError(function (error) { return rxjs_1.of(({ type: actions_1.SIGNALR_HUB_FAILED_TO_START, hubName: action.hubName, url: action.url, error: error })); }));
            var state$ = hub.state$.pipe(operators_1.map(function (state) {
                if (state === 'connecting') {
                    return { type: actions_1.SIGNALR_CONNECTING, hubName: action.hubName, url: action.url };
                }
                if (state === 'connected') {
                    return { type: actions_1.SIGNALR_CONNECTED, hubName: action.hubName, url: action.url };
                }
                if (state === 'disconnected') {
                    return { type: actions_1.SIGNALR_DISCONNECTED, hubName: action.hubName, url: action.url };
                }
                if (state === 'reconnecting') {
                    return { type: actions_1.SIGNALR_RECONNECTING, hubName: action.hubName, url: action.url };
                }
            }));
            var error$ = hub.error$.pipe(operators_1.map(function (error) { return ({ type: actions_1.SIGNALR_ERROR, hubName: action.hubName, url: action.url, error: error }); }));
            return rxjs_1.merge(start$, state$, error$);
        }));
        this.stateKey = this.config.stateKey;
    }
    __decorate([
        effects_1.Effect()
    ], SignalREffects.prototype, "hubUnstartedWhenCreated$", void 0);
    __decorate([
        effects_1.Effect()
    ], SignalREffects.prototype, "startHub$", void 0);
    SignalREffects = __decorate([
        core_1.Injectable(),
        __param(2, core_1.Inject(module_1.SIGNALR_CONFIG))
    ], SignalREffects);
    return SignalREffects;
}());
exports.SignalREffects = SignalREffects;
