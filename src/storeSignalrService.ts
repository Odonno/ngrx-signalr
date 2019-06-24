import { Injectable } from "@angular/core";
import { createHub, findHub } from "./hub";

@Injectable({
    providedIn: 'root',
})
export class StoreSignalRService {
    findHub(x: string | { hubName: string, url: string }, url?: string | undefined) {
        if (typeof x === 'string') {
            return findHub(x, url || '');
        } else {
            return findHub(x.hubName, x.url);
        }
    }

    createHub(hubName: string, url?: string | undefined) {
        return createHub(hubName, url);
    }
}