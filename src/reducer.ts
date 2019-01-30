import { Action } from "@ngrx/store";
import { SignalRHub } from "./hub";
import { SignalRAction } from "./actions";

export interface BaseSignalRStoreState {
    hubs: SignalRHub[];
}

export type SignalRReducerState<T extends BaseSignalRStoreState> = {
    state: T;
}

export const signalrReducer = <T extends BaseSignalRStoreState>(
    state: SignalRReducerState<T> | undefined,
    action: Action
): SignalRReducerState<T> => {
    const signalrAction = action as SignalRAction;
    switch (signalrAction.type) {
        default:
            return state as SignalRReducerState<T>;
    }
}