"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("signalr");
var rxjs_1 = require("rxjs");
// TODO : create ngrx actions for connection state
var connecting = 'connecting';
var connected = 'connected';
var disconnected = 'disconnected';
var reconnecting = 'reconnecting';
var SignalRState = {
    connecting: connecting,
    connected: connected,
    disconnected: disconnected,
    reconnecting: reconnecting
};
exports.SignalRState = SignalRState;
var toSignalRState = function (state) {
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
var SignalRHub = /** @class */ (function () {
    function SignalRHub(hubName, url) {
        this.hubName = hubName;
        this.url = url;
        this._startSubject = new rxjs_1.Subject();
        this._stateSubject = new rxjs_1.Subject();
        this._errorSubject = new rxjs_1.Subject();
        this._subjects = {};
        this.start$ = this._startSubject.asObservable();
        this.state$ = this._stateSubject.asObservable();
        this.error$ = this._errorSubject.asObservable();
    }
    SignalRHub.prototype.start = function () {
        var _this = this;
        if (!this._connection) {
            this._connection = this.createConnection();
        }
        if (!this.hasSubscriptions()) {
            console.warn('No listeners have been setup. You need to setup a listener before starting the connection or you will not receive data.');
        }
        this._connection.start()
            .done(function (_) { return _this._startSubject.next(); })
            .fail(function (error) { return _this._startSubject.error(error); });
    };
    SignalRHub.prototype.on = function (event) {
        if (!this._connection) {
            console.warn('Impossible to listen to event type ' + event + '.');
            return new rxjs_1.Observable();
        }
        if (!this._proxy) {
            this._proxy = this._connection.createHubProxy(this.hubName);
        }
        var subject = this.getOrCreateSubject(event);
        this._proxy.on(event, function (data) { return subject.next(data); });
        return subject.asObservable();
    };
    SignalRHub.prototype.send = function (method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a;
        if (!this._connection) {
            return Promise.reject('The connection has not been started yet. Please start the connection by invoking the start method befor attempting to send a message to the server.');
        }
        if (!this._proxy) {
            this._proxy = this._connection.createHubProxy(this.hubName);
        }
        return (_a = this._proxy).invoke.apply(_a, [method].concat(args));
    };
    SignalRHub.prototype.hasSubscriptions = function () {
        for (var key in this._subjects) {
            if (this._subjects.hasOwnProperty(key)) {
                return true;
            }
        }
        return false;
    };
    // TODO : extract function
    SignalRHub.prototype.getOrCreateSubject = function (event) {
        return this._subjects[event] || (this._subjects[event] = new rxjs_1.Subject());
    };
    // TODO : extract function
    SignalRHub.prototype.createConnection = function () {
        var _this = this;
        if (!$) {
            return { error: new Error('jQuery is not defined.') };
        }
        if (!$.hubConnection) {
            return { error: new Error('The $.hubConnection function is not defined. Please check if you imported SignalR correctly.') };
        }
        var connection = $.hubConnection(this.url);
        connection.error(function (error) {
            return _this._errorSubject.next(error);
        });
        connection.stateChanged(function (state) {
            return _this._stateSubject.next(toSignalRState(state.newState));
        });
        return { connection: connection };
    };
    return SignalRHub;
}());
var hubs = [];
var getHub = function (hubName, url) {
    return hubs.filter(function (h) { return h.hubName === hubName && h.url === url; })[0];
};
var addHub = function (hubName, url) {
    var hub = new SignalRHub(hubName, url);
    hubs.push(hub);
    return hub;
};
var createSignalRHub = function (hubName, url) {
    return getHub(hubName, url) || addHub(hubName, url);
};
exports.createSignalRHub = createSignalRHub;
