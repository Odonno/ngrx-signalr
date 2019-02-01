"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("signalr");
exports.SIGNALR_CREATE_HUB = '@ngrx/signalr/createHub';
exports.createSignalRHub = function (hubName, url) {
    return ({ type: exports.SIGNALR_CREATE_HUB, hubName: hubName, url: url });
};
exports.SIGNALR_HUB_UNSTARTED = '@ngrx/signalr/hubUnstarted';
exports.SIGNALR_START_HUB = '@ngrx/signalr/startHub';
exports.startSignalRHub = function (hubName, url) {
    return ({ type: exports.SIGNALR_START_HUB, hubName: hubName, url: url });
};
exports.SIGNALR_HUB_STARTED = '@ngrx/signalr/hubStarted';
exports.SIGNALR_HUB_FAILED_TO_START = '@ngrx/signalr/hubFailedToStart';
exports.SIGNALR_CONNECTING = '@ngrx/signalr/connecting';
exports.SIGNALR_CONNECTED = '@ngrx/signalr/connected';
exports.SIGNALR_DISCONNECTED = '@ngrx/signalr/disconnected';
exports.SIGNALR_RECONNECTING = '@ngrx/signalr/reconnecting';
exports.SIGNALR_ERROR = '@ngrx/signalr/error';
