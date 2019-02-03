import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of, merge, empty } from "rxjs";
import { map, mergeMap, catchError, tap } from 'rxjs/operators';

import { SIGNALR_HUB_UNSTARTED, SignalRHubUnstartedAction, SIGNALR_HUB_FAILED_TO_START, SIGNALR_ERROR, SIGNALR_CONNECTING, SIGNALR_CONNECTED, SIGNALR_DISCONNECTED, SIGNALR_RECONNECTING, SIGNALR_CREATE_HUB, SignalRCreateHubAction, SignalRStartHubAction, SIGNALR_START_HUB } from "./actions";
import { findHub, createHub } from "./hub";

@Injectable()
export class SignalREffects {
    // handle hub creation (then hub unstarted by default)
    @Effect()
    createHub$ = this.actions$.pipe(
        ofType<SignalRCreateHubAction>(SIGNALR_CREATE_HUB),
        mergeMap(action => {
            const hub = createHub(action.hubName, action.url);
            return of({ type: SIGNALR_HUB_UNSTARTED, hubName: hub.hubName, url: hub.url });
        })
    );

    // listen to start result (success/fail)
    // listen to change connection state (connecting, connected, disconnected, reconnecting)
    // listen to hub error
    @Effect()
    beforeStartHub$ = this.actions$.pipe(
        ofType<SignalRHubUnstartedAction>(SIGNALR_HUB_UNSTARTED),
        mergeMap(action => {
            const hub = findHub(action.hubName, action.url);

            if (!hub) {
                return empty();
            }

            const start$ = hub.start$.pipe(
                mergeMap(_ => empty()),
                catchError(error => of(({ type: SIGNALR_HUB_FAILED_TO_START, hubName: action.hubName, url: action.url, error })))
            );

            const state$ = hub.state$.pipe(
                map(state => {
                    if (state === 'connecting') {
                        return { type: SIGNALR_CONNECTING, hubName: action.hubName, url: action.url };
                    }
                    if (state === 'connected') {
                        return { type: SIGNALR_CONNECTED, hubName: action.hubName, url: action.url };
                    }
                    if (state === 'disconnected') {
                        return { type: SIGNALR_DISCONNECTED, hubName: action.hubName, url: action.url };
                    }
                    if (state === 'reconnecting') {
                        return { type: SIGNALR_RECONNECTING, hubName: action.hubName, url: action.url };
                    }
                })
            );

            const error$ = hub.error$.pipe(
                map(error => ({ type: SIGNALR_ERROR, hubName: action.hubName, url: action.url, error }))
            );

            return merge(start$, state$, error$);
        })
    );

    // start hub
    @Effect({ dispatch: false })
    startHub$ = this.actions$.pipe(
        ofType<SignalRStartHubAction>(SIGNALR_START_HUB),
        tap(action => {
            const hub = findHub(action);
            if (hub) {
                hub.start();
            }
        })
    );

    constructor(private actions$: Actions) { }
}