export { SignalRError, SignalRState, createSignalRHub, findHub } from "./src/hub";
export { BaseSignalRStoreState, signalrReducer } from './src/reducer';

// TODO : provide a way to get the current state of a SignalRHub (selector?)