import { Action } from "@ngrx/store";

export type HubKeyDefinition = {
    hubName: string;
    url?: string | undefined;
};

export type HubFullDefinition = HubKeyDefinition & {
    options?: SignalR.ConnectionOptions | undefined;
};

export interface HubAction extends Action {
    hubName: string;
    url?: string | undefined;
}