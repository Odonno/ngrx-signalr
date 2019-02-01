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
var hub_1 = require("./hub");
var actions_1 = require("./actions");
var initialState = {
    hubs: []
};
exports.signalrReducer = function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case actions_1.SIGNALR_CREATE_HUB:
            return __assign({}, state, { hubs: state.hubs.concat([new hub_1.SignalRHub(action.hubName, action.url)]) });
        default:
            return state;
    }
};
