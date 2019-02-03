import 'signalr';
import { Subject, from, throwError } from 'rxjs';
import { toSignalRState } from './hubStatus';
const getOrCreateSubject = (subjects, event) => {
    return subjects[event] || (subjects[event] = new Subject());
};
const createConnection = (url, errorSubject, stateSubject) => {
    if (!$) {
        return { error: new Error('jQuery is not defined.') };
    }
    if (!$.hubConnection) {
        return { error: new Error('The $.hubConnection function is not defined. Please check if you imported SignalR correctly.') };
    }
    const connection = $.hubConnection(url);
    if (!connection) {
        return { error: new Error("Impossible to create the hub '" + url + "'.") };
    }
    connection.error((error) => errorSubject.next(error));
    connection.stateChanged((state) => stateSubject.next(toSignalRState(state.newState)));
    return { connection };
};
export class SignalRHub {
    constructor(hubName, url) {
        this.hubName = hubName;
        this.url = url;
        this._startSubject = new Subject();
        this._stateSubject = new Subject();
        this._errorSubject = new Subject();
        this._subjects = {};
        this.start$ = this._startSubject.asObservable();
        this.state$ = this._stateSubject.asObservable();
        this.error$ = this._errorSubject.asObservable();
    }
    start() {
        if (!this._connection) {
            const { connection, error } = createConnection(this.url, this._errorSubject, this._stateSubject);
            if (error) {
                this._startSubject.error(error);
                return throwError(error);
            }
            this._connection = connection;
            if (!this._connection) {
                const error = new Error('Impossible to start the connection...');
                this._startSubject.error(error);
                return throwError(error);
            }
        }
        if (!this.hasSubscriptions()) {
            console.warn('No listeners have been setup. You need to setup a listener before starting the connection or you will not receive data.');
        }
        this._connection.start()
            .done(_ => this._startSubject.next())
            .fail((error) => this._startSubject.error(error));
        return this._startSubject.asObservable();
    }
    on(event) {
        if (!this._connection) {
            const { connection, error } = createConnection(this.url, this._errorSubject, this._stateSubject);
            if (error) {
                this._startSubject.error(error);
                return throwError(error);
            }
            this._connection = connection;
            if (!this._connection) {
                return throwError(new Error('Impossible to listen to the connection...'));
            }
        }
        if (!this._proxy) {
            this._proxy = this._connection.createHubProxy(this.hubName);
        }
        const subject = getOrCreateSubject(this._subjects, event);
        this._proxy.on(event, (data) => subject.next(data));
        return subject.asObservable();
    }
    send(method, ...args) {
        if (!this._connection) {
            return throwError('The connection has not been started yet. Please start the connection by invoking the start method before attempting to send a message to the server.');
        }
        if (!this._proxy) {
            this._proxy = this._connection.createHubProxy(this.hubName);
        }
        return from(this._proxy.invoke(method, ...args));
    }
    hasSubscriptions() {
        for (let key in this._subjects) {
            if (this._subjects.hasOwnProperty(key)) {
                return true;
            }
        }
        return false;
    }
}
const hubs = [];
export function findHub(x, url) {
    if (typeof x === 'string') {
        return hubs.filter(h => h.hubName === x && h.url === url)[0];
    }
    return hubs.filter(h => h.hubName === x.hubName && h.url === x.url)[0];
}
;
export const createHub = (hubName, url) => {
    const hub = new SignalRHub(hubName, url);
    hubs.push(hub);
    return hub;
};
