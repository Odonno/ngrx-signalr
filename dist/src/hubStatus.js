"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var unstarted = 'unstarted';
var started = 'started';
var connecting = 'connecting';
var connected = 'connected';
var disconnected = 'disconnected';
var reconnecting = 'reconnecting';
exports.SignalRStates = {
    unstarted: unstarted,
    started: started,
    connecting: connecting,
    connected: connected,
    disconnected: disconnected,
    reconnecting: reconnecting
};
exports.toSignalRState = function (state) {
    switch (state) {
        case 0 /* Connecting */:
            return connecting;
        case 1 /* Connected */:
            return connected;
        case 4 /* Disconnected */:
            return disconnected;
        case 2 /* Reconnecting */:
            return reconnecting;
    }
};
