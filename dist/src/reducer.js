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
    hubStatus: []
};
exports.signalrReducer = function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case actions_1.SIGNALR_CREATE_HUB:
            var newHubStatus = {
                hubName: action.hubName,
                url: action.url,
                state: 'unstarted'
            };
            return __assign({}, state, { hubStatus: state.hubStatus.concat([newHubStatus]) });
        default:
            return state;
    }
};
