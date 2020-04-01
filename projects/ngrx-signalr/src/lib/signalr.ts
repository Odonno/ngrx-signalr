import 'signalr';
import { Subject } from 'rxjs';
import { toSignalRState } from './hubStatus';

let localCachedConnection: SignalR.Hub.Connection | undefined = undefined;
const cachedConnections: { [url: string]: SignalR.Hub.Connection } = {};

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