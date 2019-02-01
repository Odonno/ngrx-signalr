import { SignalRHub } from "./hub";
import { SignalRAction, SIGNALR_CREATE_HUB } from "./actions";

const initialState = {
    hubs: []
};

export interface BaseSignalRStoreState {
    hubs: SignalRHub[];
}

export const signalrReducer = (
    state: BaseSignalRStoreState = initialState,
    action: SignalRAction
): BaseSignalRStoreState => {
    switch (action.type) {
        case SIGNALR_CREATE_HUB:
            return {
                ...state,
                hubs: state.hubs.concat([new SignalRHub(action.hubName, action.url)])
            };
        default:
            return state;
    }
}