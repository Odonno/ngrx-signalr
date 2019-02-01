"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("signalr");
var rxjs_1 = require("rxjs");
// TODO : use ngrx actions instead
var connecting = 'connecting';
var connected = 'connected';
var disconnected = 'disconnected';
var reconnecting = 'reconnecting';
exports.SignalRState = {
    connecting: connecting,
    connected: connected,
    disconnected: disconnected,
    reconnecting: reconnecting
};
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
var getOrCreateSubject = function (subjects, event) {
    return subjects[event] || (subjects[event] = new rxjs_1.Subject());
};
var createConnection = function (url, errorSubject, stateSubject) {
    if (!$) {
        return { error: new Error('jQuery is not defined.') };
    }
    if (!$.hubConnection) {
        return { error: new Error('The $.hubConnection function is not defined. Please check if you imported SignalR correctly.') };
    }
    var connection = $.hubConnection(url);
    if (!connection) {
        return { error: new Error("Impossible to create the hub '" + url + "'.") };
    }
    connection.error(function (error) {
        return errorSubject.next(error);
    });
    connection.stateChanged(function (state) {
        return stateSubject.next(toSignalRState(state.newState));
    });
    return { connection: connection };
};
// TODO : should create an immutable object (with only props: hubName, url and state) = SignalRHubStatus
var SignalRHub = /** @class */ (function () {
    function SignalRHub(hubName, url) {
        this.hubName = hubName;
        this.url = url;
        this._startSubject = new rxjs_1.Subject(); // TODO : use ngrx actions instead
        this._stateSubject = new rxjs_1.Subject(); // TODO : use ngrx actions instead
        this._errorSubject = new rxjs_1.Subject(); // TODO : use ngrx actions instead
        this._subjects = {};
        this.start$ = this._startSubject.asObservable();
        this.state$ = this._stateSubject.asObservable();
        this.error$ = this._errorSubject.asObservable();
    }
    // TODO : return an observable
    SignalRHub.prototype.start = function () {
        var _this = this;
        if (!this._connection) {
            var _a = createConnection(this.url, this._errorSubject, this._stateSubject), connection = _a.connection, error = _a.error;
            if (error) {
                this._startSubject.error(error);
                return;
            }
            this._connection = connection;
        }
        if (!this._connection) {
            this._startSubject.error(new Error('Impossible to start the connection...'));
            return;
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
            console.warn('The connection has not been started yet. Please start the connection by invoking the start method before attempting to listen to event type ' + event + '.');
            return new rxjs_1.Observable();
        }
        if (!this._proxy) {
            this._proxy = this._connection.createHubProxy(this.hubName);
        }
        var subject = getOrCreateSubject(this._subjects, event);
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
            return rxjs_1.throwError('The connection has not been started yet. Please start the connection by invoking the start method before attempting to send a message to the server.');
        }
        if (!this._proxy) {
            this._proxy = this._connection.createHubProxy(this.hubName);
        }
        return rxjs_1.from((_a = this._proxy).invoke.apply(_a, [method].concat(args)));
    };
    SignalRHub.prototype.hasSubscriptions = function () {
        for (var key in this._subjects) {
            if (this._subjects.hasOwnProperty(key)) {
                return true;
            }
        }
        return false;
    };
    return SignalRHub;
}());
exports.SignalRHub = SignalRHub;
// TODO : use the hubs in the ngrx store
var hubs = [];
// TODO : use a ngrx selector instead
exports.findHub = function (hubName, url) {
    return hubs.filter(function (h) { return h.hubName === hubName && h.url === url; })[0];
};
var addHub = function (hubName, url) {
    var hub = new SignalRHub(hubName, url);
    hubs.push(hub);
    return hub;
};
// TODO : dispatch an action
exports.createSignalRHub = function (hubName, url) {
    return exports.findHub(hubName, url) || addHub(hubName, url);
};
