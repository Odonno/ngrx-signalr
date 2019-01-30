import { Action } from "@ngrx/store";
import { SignalRHub } from "./hub";
export interface BaseSignalRStoreState {
    hubs: SignalRHub[];
}
export declare type SignalRReducerState<T extends BaseSignalRStoreState> = {
    state: T;
};
export declare const signalrReducer: <T extends BaseSignalRStoreState>(state: SignalRReducerState<T> | undefined, action: Action) => SignalRReducerState<T>;
