"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hub_1 = require("./src/hub");
exports.createSignalRHub = hub_1.createSignalRHub;
exports.findHub = hub_1.findHub;
var hubStatus_1 = require("./src/hubStatus");
exports.SignalRStates = hubStatus_1.SignalRStates;
var reducer_1 = require("./src/reducer");
exports.signalrReducer = reducer_1.signalrReducer;
// TODO : provide a way to get the current state of a SignalRHub (selector?)
