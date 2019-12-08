import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { of, merge, EMPTY, timer } from "rxjs";
import { map, mergeMap, catchError, tap, switchMap, takeUntil, groupBy } from 'rxjs/operators';

import { findHub, createHub } from "./hub";
import { createSignalRHub, signalrHubUnstarted, signalrHubFailedToStart, signalrConnected, signalrDisconnected, signalrError, startSignalRHub, signalrConnecting, signalrReconnecting, stopSignalRHub } from "./actions";
import { ofHub, exhaustMapHubToAction, isOnline } from "./operators";
import { Action } from "@ngrx/store";

@Injectable({
    providedIn: 'root'
})
/**
 * Collection of effects to execute realtime events (hub creation, starting, stopping, etc..).
 */
export class SignalREffects {
    /**
     * Automatically create a new SignalR hub (then set hub state to `unstarted` by default).
     */
    createHub$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createSignalRHub),
            mergeMap(action => {
                const hub = createHub(action.hubName, action.url, action.useSharedConnection);
                if (!hub) {
                    return EMPTY;
                }

                return of(signalrHubUnstarted({ hubName: hub.hubName, url: hub.url }));
            })
        )
    );

    /**
     * Listen to every change on the SignalR hub.
     * Listen to start result (success/fail).
     * Listen to change connection state (connecting, connected, disconnected, reconnecting).
     * Listen to hub error.
     */
    beforeStartHub$ = createEffect(() =>
        this.actions$.pipe(
            ofType(signalrHubUnstarted),
            mergeMap(action => {
                const hub = findHub(action);

                if (!hub) {
                    return EMPTY;
                }

                const start$ = hub.start$.pipe(
                    mergeMap(_ => EMPTY),
                    catchError(error => of(signalrHubFailedToStart({ hubName: action.hubName, url: action.url, error })))
                );

                const state$ = hub.state$.pipe(
                    mergeMap(state => {
                        if (state === 'connecting') {
                            return of(signalrConnecting({ hubName: action.hubName, url: action.url }));
                        }
                        if (state === 'connected') {
                            return of(signalrConnected({ hubName: action.hubName, url: action.url }));
                        }
                        if (state === 'disconnected') {
                            return of(signalrDisconnected({ hubName: action.hubName, url: action.url }));
                        }
                        if (state === 'reconnecting') {
                            return of(signalrReconnecting({ hubName: action.hubName, url: action.url }));
                        }
                        return EMPTY;
                    })
                );

                const error$ = hub.error$.pipe(
                    map(error => signalrError({ hubName: action.hubName, url: action.url, error }))
                );

                return merge(start$, state$, error$);
            })
        )
    );

    /**
     * Automatically start hub based on actions dispatched.
     */
    startHub$ = createEffect(() =>
        this.actions$.pipe(
            ofType(startSignalRHub),
            tap(action => {
                const hub = findHub(action);
                if (hub) {
                    hub.start(action.options);
                }
            })
        ),
        { dispatch: false }
    );

    /**
     * Automatically stop hub based on actions dispatched.
     */
    stopHub$ = createEffect(() =>
        this.actions$.pipe(
            ofType(stopSignalRHub),
            tap(action => {
                const hub = findHub(action);
                if (hub) {
                    hub.stop(action.async, action.notifyServer);
                }
            })
        ),
        { dispatch: false }
    );

    constructor(private actions$: Actions) { }
}

/**
 * Create an @ngrx effect to handle SignalR reconnection automatically.
 * @param actions$ Observable of all actions dispatched in the current app.
 * @param intervalTimespan Timespan between each reconnection attempt (in milliseconds).
 */
export const createReconnectEffect = (actions$: Actions<Action>, intervalTimespan: number) => {
    return createEffect(() =>
        actions$.pipe(
            ofType(signalrDisconnected),
            groupBy(action => action.hubName),
            mergeMap(group =>
                group.pipe(
                    exhaustMapHubToAction(({ action, hub }) =>
                        isOnline().pipe(
                            switchMap(online => {
                                if (!online) {
                                    return EMPTY;
                                }
                                return timer(0, intervalTimespan);
                            }),
                            map(_ => startSignalRHub({
                                hubName: hub.hubName,
                                url: hub.url,
                                options: hub.options
                            })),
                            takeUntil(
                                actions$.pipe(
                                    ofType(signalrConnected),
                                    ofHub(action)
                                )
                            )
                        )
                    )
                )
            )
        )
    );
};