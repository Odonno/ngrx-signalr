"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    function SignalRHub(_hubName, _url) {
        this._hubName = _hubName;
        this._url = _url;
        this._subjects = {};
        this._state$ = new rxjs_1.Subject();
        this._error$ = new rxjs_1.Subject();
    }
    Object.defineProperty(SignalRHub.prototype, "connection", {
        get: function () {
            return this._connection || (this._connection = this.createConnection());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignalRHub.prototype, "proxy", {
        get: function () {
            return this._proxy || (this._proxy = this.connection.createHubProxy(this.hubName));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignalRHub.prototype, "hubName", {
        get: function () {
            return this._hubName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignalRHub.prototype, "url", {
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignalRHub.prototype, "state$", {
        get: function () {
            return this._state$.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignalRHub.prototype, "error$", {
        get: function () {
            return this._error$.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    SignalRHub.prototype.start = function () {
        if (!this.hasSubscriptions()) {
            console.warn('No listeners have been setup. You need to setup a listener before starting the connection or you will not receive data.');
        }
        this._primePromise = this.connection.start();
        return this._primePromise;
    };
    SignalRHub.prototype.on = function (event) {
        var subject = this.getOrCreateSubject(event);
        this.proxy.on(event, function (data) { return subject.next(data); });
        return subject.asObservable();
    };
    SignalRHub.prototype.send = function (method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this._primePromise) {
                            return [2 /*return*/, Promise.reject('The connection has not been started yet. Please start the connection by invoking the start method befor attempting to send a message to the server.')];
                        }
                        return [4 /*yield*/, this._primePromise];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, (_a = this.proxy).invoke.apply(_a, [method].concat(args))];
                }
            });
        });
    };
    SignalRHub.prototype.hasSubscriptions = function () {
        for (var key in this._subjects) {
            if (this._subjects.hasOwnProperty(key)) {
                return true;
            }
        }
        return false;
    };
    SignalRHub.prototype.getOrCreateSubject = function (event) {
        return this._subjects[event] || (this._subjects[event] = new rxjs_1.Subject());
    };
    SignalRHub.prototype.createConnection = function () {
        var _this = this;
        var connection = $.hubConnection(this._url);
        connection.error(function (error) {
            return _this._error$.next(error);
        });
        connection.stateChanged(function (state) {
            return _this._state$.next(toSignalRState(state.newState));
        });
        return connection;
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
