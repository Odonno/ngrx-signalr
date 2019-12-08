import { HubKeyDefinition } from "./models";

const unstarted = 'unstarted';
const connecting = 'connecting';
const connected = 'connected';
const disconnected = 'disconnected';
const reconnecting = 'reconnecting';

/**
 * List of given states a SignalR can be.
 */
export const SignalRStates = {
    unstarted,
    connecting,
    connected,
    disconnected,
    reconnecting
}

/**
 * Convert a hub connection state to the internal state value.
 * @param state The state of the hub connection.
 */
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

/**
 * Connection state definition of a SignalR hub.
 */
export type SignalRHubState =
    | typeof unstarted
    | typeof connecting
    | typeof connected
    | typeof disconnected
    | typeof reconnecting;

/**
* Status definition of a SignalR hub.
*/
export type SignalRHubStatus = HubKeyDefinition & {
    state: SignalRHubState;
}