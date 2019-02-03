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
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("./actions");
var initialState = {
    hubStatuses: []
};
exports.signalrReducer = function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case actions_1.SIGNALR_CREATE_HUB:
            var newHubStatus = {
                hubName: action.hubName,
                url: action.url,
                state: undefined
            };
            return __assign({}, state, { hubStatuses: state.hubStatuses.concat([newHubStatus]) });
        case actions_1.SIGNALR_HUB_UNSTARTED:
            return __assign({}, state, { hubStatuses: state.hubStatuses.map(function (hs) {
                    if (hs.hubName === action.hubName && hs.url === action.url) {
                        return __assign({}, hs, { state: 'unstarted' });
                    }
                    return hs;
                }) });
        case actions_1.SIGNALR_CONNECTING:
            return __assign({}, state, { hubStatuses: state.hubStatuses.map(function (hs) {
                    if (hs.hubName === action.hubName && hs.url === action.url) {
                        return __assign({}, hs, { state: 'connecting' });
                    }
                    return hs;
                }) });
        case actions_1.SIGNALR_CONNECTED:
            return __assign({}, state, { hubStatuses: state.hubStatuses.map(function (hs) {
                    if (hs.hubName === action.hubName && hs.url === action.url) {
                        return __assign({}, hs, { state: 'connected' });
                    }
                    return hs;
                }) });
        case actions_1.SIGNALR_DISCONNECTED:
            return __assign({}, state, { hubStatuses: state.hubStatuses.map(function (hs) {
                    if (hs.hubName === action.hubName && hs.url === action.url) {
                        return __assign({}, hs, { state: 'disconnected' });
                    }
                    return hs;
                }) });
        case actions_1.SIGNALR_RECONNECTING:
            return __assign({}, state, { hubStatuses: state.hubStatuses.map(function (hs) {
                    if (hs.hubName === action.hubName && hs.url === action.url) {
                        return __assign({}, hs, { state: 'reconnecting' });
                    }
                    return hs;
                }) });
        default:
            return state;
    }
};
