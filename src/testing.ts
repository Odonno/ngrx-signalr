import { SignalRTestingHub } from "./SignalRHub.testing";

type HubCreationFunc = 
    (hubName: string, url?: string) => SignalRTestingHub | undefined;

export let testingEnabled = false;
export let hubCreationFunc: HubCreationFunc;

export const enableTesting = (func: HubCreationFunc) => {
    testingEnabled = true;
    hubCreationFunc = func;
}