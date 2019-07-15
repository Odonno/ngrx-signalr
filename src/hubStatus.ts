const unstarted = 'unstarted';
const connecting = 'connecting';
const connected = 'connected';
const disconnected = 'disconnected';
const reconnecting = 'reconnecting';

export const SignalRStates = {
    unstarted,
    connecting,
    connected,
    disconnected,
    reconnecting
}

export const toSignalRState = (state: SignalR.ConnectionState): string => {
    switch (state) {
        case SignalR.ConnectionState.Connecting:
            return connecting;
        case SignalR.ConnectionState.Connected:
            return connected;
        case SignalR.ConnectionState.Disconnected:
            return disconnected;
        case SignalR.ConnectionState.Reconnecting:
            return reconnecting;
    }
}

export type SignalRHubState =
    | typeof unstarted
    | typeof connecting
    | typeof connected
    | typeof disconnected
    | typeof reconnecting;

export type SignalRHubStatus = {
    hubName: string;
    url: string | undefined;
    state: SignalRHubState;
}