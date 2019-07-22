/// <reference types="signalr" />
import { Action } from "@ngrx/store";
export declare type HubKeyDefinition = {
    hubName: string;
    url?: string | undefined;
};
export declare type HubFullDefinition = HubKeyDefinition & {
    options?: SignalR.ConnectionOptions | undefined;
};
export interface HubAction extends Action {
    hubName: string;
    url?: string | undefined;
}
