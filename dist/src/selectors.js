"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var module_1 = require("./module");
var store_1 = require("@ngrx/store");
exports.selectSignalrState = function (state) { return state[module_1.DEFAULT_SIGNALR_FEATURENAME]; };
exports.selectHubsStatuses = store_1.createSelector(exports.selectSignalrState, function (state) { return state.hubStatuses; });
exports.selectHubStatus = store_1.createSelector(exports.selectSignalrState, function (state, _a) {
    var hubName = _a.hubName, url = _a.url;
    return state.hubStatuses.filter(function (hs) { return hs.hubName === hubName && hs.url === url; })[0];
});
exports.selectAreAllHubsConnected = store_1.createSelector(exports.selectHubsStatuses, function (hubStatuses) { return hubStatuses.every(function (hs) { return hs.state === 'connected'; }); });
