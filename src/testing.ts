import { SignalRTestingHub } from "./hub";

type HubCreationFunc = 
    (hubName: string, url?: string | undefined) => SignalRTestingHub | undefined;

export let testingEnabled = false;
export let hubCreationFunc: HubCreationFunc;

export const enableTesting = (func: HubCreationFunc) => {
    testingEnabled = true;
    hubCreationFunc = func;
}