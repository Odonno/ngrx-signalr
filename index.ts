export { SignalRError, createHub, findHub } from "./src/hub";
export { SignalRStates, SignalRHubState, SignalRHubStatus } from './src/hubStatus';
export { BaseSignalRStoreState, signalrReducer } from './src/reducer';

// TODO : provide a way to get the current state of a SignalRHub (findHub selector?)