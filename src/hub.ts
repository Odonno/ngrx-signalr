import 'signalr';
import { Subject } from 'rxjs';
import { toSignalRState } from './hubStatus';
import { hubCreationFunc, testingEnabled } from './testing';
import { ISignalRHub } from './SignalRHub.interface';
import { SignalRHub } from './SignalRHub';

const hubs: ISignalRHub[] = [];

let localCachedConnection: SignalR.Hub.Connection | undefined = undefined;
const cachedConnections: { [url: string]: SignalR.Hub.Connection } = {};

/**
 * Find an existing SignalR hub instance.
 * @param hubName Name of the hub.
 * @param url Url of the hub.
 */
export function findHub(hubName: string, url?: string): ISignalRHub | undefined;
/**
 * Find an existing SignalR hub instance.
 * @param param0 Object that contains information to indentify a hub (name, url).
 */
export function findHub({ hubName, url }: { hubName: string, url?: string }): ISignalRHub | undefined;
export function findHub(x: string | { hubName: string, url?: string }, url?: string): ISignalRHub | undefined {
    if (typeof x === 'string') {
        return hubs.filter(h => h.hubName === x && h.url === url)[0];
    }
    return hubs.filter(h => h.hubName === x.hubName && h.url === x.url)[0];
};

/**
 * Create a new SignalR hub instance.
 * @param hubName Name of the hub.
 * @param url Url of the hub.
 * @param useSharedConnection Indicates if the hub should the same connection if other hubs have the same url.
 */
export const createHub = (hubName: string, url?: string, useSharedConnection?: boolean): ISignalRHub | undefined => {
    if (testingEnabled) {
        const hub = hubCreationFunc(hubName, url);
        if (hub) {
            hubs.push(hub);
            return hub;
        }
        return undefined;
    }

    const hub = new SignalRHub(hubName, url, useSharedConnection || true);
    hubs.push(hub);
    return hub;
}

const getOrCreateCachedConnection = (url?: string) => {
    if (url) {
        if (!cachedConnections[url]) {
            cachedConnections[url] = $.hubConnection(url);
        }

        return cachedConnections[url];
    }

    if (!localCachedConnection) {
        localCachedConnection = $.hubConnection(url);
    }

    return localCachedConnection;
}

export const createConnection = (
    url: string | undefined,
    errorSubject: Subject<SignalR.ConnectionError>,
    stateSubject: Subject<string>,
    useSharedConnection: boolean
): { connection?: SignalR.Hub.Connection, error?: Error } => {
    if (!$) {
        return { error: new Error('jQuery is not defined.') }
    }
    if (!$.hubConnection) {
        return { error: new Error('The $.hubConnection function is not defined. Please check if you imported SignalR correctly.') }
    }

    const connection = useSharedConnection
        ? getOrCreateCachedConnection(url)
        : $.hubConnection(url);

    if (!connection) {
        return { error: new Error("Impossible to create the hub '" + url + "'.") }
    }

    connection.error((error: SignalR.ConnectionError) =>
        errorSubject.next(error)
    );
    connection.stateChanged((state: SignalR.StateChanged) =>
        stateSubject.next(toSignalRState(state.newState))
    );

    return { connection };
}

export const getOrCreateSubject = <T>(subjects: { [name: string]: Subject<any> }, event: string): Subject<T> => {
    return subjects[event] || (subjects[event] = new Subject<T>());
}