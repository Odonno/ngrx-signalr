import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { of, merge, EMPTY, fromEvent, timer } from "rxjs";
import { map, mergeMap, catchError, tap, startWith, switchMap, takeUntil, exhaustMap, groupBy } from 'rxjs/operators';

import { findHub, createHub } from "./hub";
import { createSignalRHub, signalrHubUnstarted, signalrHubFailedToStart, signalrConnected, signalrDisconnected, signalrError, startSignalRHub, signalrConnecting, signalrReconnecting, hubNotFound } from "./actions";
import { ofHub } from "./operators";
import { Action } from "@ngrx/store";

@Injectable({
    providedIn: 'root'
})
export class SignalREffects {
    // handle hub creation (then hub unstarted by default)
    createHub$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createSignalRHub),
            mergeMap(action => {
                const hub = createHub(action.hubName, action.url);
                if (!hub) {
                    return EMPTY;
                }

                return of(signalrHubUnstarted({ hubName: hub.hubName, url: hub.url }));
            })
        )
    );

    // listen to start result (success/fail)
    // listen to change connection state (connecting, connected, disconnected, reconnecting)
    // listen to hub error
    beforeStartHub$ = createEffect(() =>
        this.actions$.pipe(
            ofType(signalrHubUnstarted),
            mergeMap(action => {
                const hub = findHub(action.hubName, action.url);

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

    // start hub
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

    constructor(private actions$: Actions) { }
}


const offline$ = fromEvent(window, 'offline').pipe(
    map(() => false)
);
const online$ = fromEvent(window, 'online').pipe(
    map(() => true)
);

const isOnline = () => merge(offline$, online$).pipe(
    startWith(navigator.onLine)
);

export const createReconnectEffect = (actions$: Actions<Action>, intervalTimespan: number) => {
    return createEffect(() =>
        actions$.pipe(
            ofType(signalrDisconnected),
            groupBy(action => action.hubName),
            mergeMap(group => {
                return group.pipe(
                    exhaustMap(action => {
                        const hub = findHub(action);
                        if (!hub) {
                            return of(hubNotFound(action));
                        }

                        return isOnline().pipe(
                            switchMap(online => {
                                if (!online) {
                                    return EMPTY;
                                }
                                return timer(0, intervalTimespan);
                            }),
                            map(_ => startSignalRHub(hub)),
                            takeUntil(
                                actions$.pipe(
                                    ofType(signalrConnected),
                                    ofHub(action)
                                )
                            )
                        );
                    })
                );
            })
        )
    );
};