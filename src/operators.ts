import { filter, map } from "rxjs/operators";
import { MonoTypeOperatorFunction } from "rxjs";
import { Action } from "@ngrx/store";
import { findHub } from "./hub";

interface HubAction extends Action {
    hubName: string;
    url?: string | undefined;
}

export function ofHub(hubName: string, url?: string | undefined): MonoTypeOperatorFunction<HubAction>;
export function ofHub({ hubName, url }: { hubName: string, url?: string | undefined }): MonoTypeOperatorFunction<HubAction>;
export function ofHub(x: string | { hubName: string, url?: string | undefined }, url?: string | undefined): MonoTypeOperatorFunction<HubAction> {
    if (typeof x === 'string') {
        return filter((action: HubAction) => action.hubName === x && action.url === url);
    } else {
        return filter(action => action.hubName === x.hubName && action.url === x.url);
    }
}

export const mapToHub = () => map(findHub);