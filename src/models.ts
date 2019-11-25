import { Action } from "@ngrx/store";

export type HubKeyDefinition = {
    hubName: string;
    url?: string;
};

export type HubFullDefinition = HubKeyDefinition & {
    options?: SignalR.ConnectionOptions;
};

export interface HubAction extends Action {
    hubName: string;
    url?: string;
}