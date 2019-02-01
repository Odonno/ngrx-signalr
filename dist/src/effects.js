"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var effects_1 = require("@ngrx/effects");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var actions_1 = require("./actions");
var hub_1 = require("./hub");
var SignalREffects = /** @class */ (function () {
    function SignalREffects(actions$) {
        this.actions$ = actions$;
        // handle hub creation (then hub unstarted by default)
        this.createHub$ = this.actions$.pipe(effects_1.ofType(actions_1.SIGNALR_CREATE_HUB), operators_1.mergeMap(function (action) {
            var hub = hub_1.createHub(action.hubName, action.url);
            return rxjs_1.of({ type: actions_1.SIGNALR_HUB_UNSTARTED, hubName: hub.hubName, url: hub.url });
        }));
        // listen to start result (success/fail)
        // listen to change connection state (connecting, connected, disconnected, reconnecting)
        // listen to hub error
        this.startHub$ = this.actions$.pipe(effects_1.ofType(actions_1.SIGNALR_HUB_UNSTARTED), operators_1.mergeMap(function (action) {
            var hub = hub_1.findHub(action.hubName, action.url);
            if (!hub) {
                return rxjs_1.empty();
            }
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
    }
    __decorate([
        effects_1.Effect()
    ], SignalREffects.prototype, "createHub$", void 0);
    __decorate([
        effects_1.Effect()
    ], SignalREffects.prototype, "startHub$", void 0);
    SignalREffects = __decorate([
        core_1.Injectable()
    ], SignalREffects);
    return SignalREffects;
}());
exports.SignalREffects = SignalREffects;
