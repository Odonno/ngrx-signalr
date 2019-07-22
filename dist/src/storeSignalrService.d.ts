import { HubKeyDefinition } from "./models";
export declare class StoreSignalRService {
    findHub(x: string | HubKeyDefinition, url?: string | undefined): import("./hub").ISignalRHub | undefined;
    createHub(hubName: string, url?: string | undefined): import("./hub").ISignalRHub | undefined;
}
