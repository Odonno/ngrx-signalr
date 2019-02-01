import { SignalRAction } from "./actions";
import { SignalRHubStatus } from "./hubStatus";
export interface BaseSignalRStoreState {
    hubStatus: SignalRHubStatus[];
}
export declare const signalrReducer: (state: BaseSignalRStoreState | undefined, action: SignalRAction) => BaseSignalRStoreState;
