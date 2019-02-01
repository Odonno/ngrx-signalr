import { SignalRHub } from "./hub";
import { SignalRAction } from "./actions";
export interface BaseSignalRStoreState {
    hubs: SignalRHub[];
}
export declare const signalrReducer: (state: BaseSignalRStoreState | undefined, action: SignalRAction) => BaseSignalRStoreState;
