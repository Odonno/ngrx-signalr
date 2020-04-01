import { SignalRTestingHub } from "./SignalRHub.testing";

type HubCreationFunc =
    (hubName: string, url?: string) => SignalRTestingHub | undefined;

export let testingEnabled = false;
export let hubCreationFunc: HubCreationFunc;

/**
 * Enable testing of the ngrx-signalr package.
 * Only use this function for testing purpose ONLY.
 * @param func A function that will used to create a new SignalR hub.
 */
export const enableTesting = (func: HubCreationFunc) => {
    testingEnabled = true;
    hubCreationFunc = func;
}