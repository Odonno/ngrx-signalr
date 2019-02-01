import { SignalRAction, SIGNALR_CREATE_HUB } from "./actions";
import { SignalRHubStatus, SignalRHubState } from "./hubStatus";

const initialState = {
    hubStatus: []
};

export interface BaseSignalRStoreState {
    hubStatus: SignalRHubStatus[];
}

export const signalrReducer = (
    state: BaseSignalRStoreState = initialState,
    action: SignalRAction
): BaseSignalRStoreState => {
    switch (action.type) {
        case SIGNALR_CREATE_HUB:
            const newHubStatus = {
                hubName: action.hubName, 
                url: action.url,
                state: 'unstarted' as SignalRHubState
            };

            return {
                ...state,
                hubStatus: state.hubStatus.concat([newHubStatus])
            };
        default:
            return state;
    }
}