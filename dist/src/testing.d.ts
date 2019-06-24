import { SignalRTestingHub } from "./hub";
declare type HubCreationFunc = (hubName: string, url?: string | undefined) => SignalRTestingHub | undefined;
export declare let testingEnabled: boolean;
export declare let hubCreationFunc: HubCreationFunc;
export declare const enableTesting: (func: HubCreationFunc) => void;
export {};
