import { Action } from "@ngrx/store";

/**
 * Information definition that identify a SignalR hub (name, url).
 */
export type HubKeyDefinition = {
    hubName: string;
    url?: string;
};

/**
 * Full definition of a SignalR hub (name, url and options).
 */
export type HubFullDefinition = HubKeyDefinition & {
    options?: SignalR.ConnectionOptions;
};

/**
 * Definition of an action that is related to a SignalR hub.
 */
export interface HubAction extends Action {
    hubName: string;
    url?: string;
}