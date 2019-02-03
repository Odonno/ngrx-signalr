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
};
export const toSignalRState = (state) => {
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
