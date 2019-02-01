import { Injectable, Inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of, merge } from "rxjs";
import { pairwise, map, filter, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';

import { StoreSignalRConfig, StateKeyOrSelector, SIGNALR_CONFIG } from "./module";
import { BaseSignalRStoreState } from "./reducer";
import { SIGNALR_HUB_UNSTARTED, SignalRHubUnstartedAction, SIGNALR_HUB_STARTED, SIGNALR_HUB_FAILED_TO_START, SIGNALR_ERROR, SIGNALR_CONNECTING, SIGNALR_CONNECTED, SIGNALR_DISCONNECTED, SIGNALR_RECONNECTING } from "./actions";

@Injectable()
export class SignalREffects {
    private stateKey: StateKeyOrSelector;

    // handle hub creation (hub unstarted by default)
    @Effect()
    hubUnstartedWhenCreated$ = this.store.select<BaseSignalRStoreState>(<string>this.stateKey).pipe(
        pairwise(),
        filter(([previousState, newState]) => previousState !== newState),
        map(([previousState, newState]) => {
            return newState.hubs
                .filter(hub => !previousState.hubs.some(h => h.hubName === hub.hubName && h.url === hub.url))
            [0];
        }),
        filter(hub => !!hub),
        map(hub => ({ type: SIGNALR_HUB_UNSTARTED, hubName: hub.hubName, url: hub.url }))
    );

    // handle start result (success/fail)
    // handle change connection state (connecting, connected, disconnected, reconnecting)
    // handle hub error
    @Effect()
    startHub$ = this.actions$.pipe(
        ofType<SignalRHubUnstartedAction>(SIGNALR_HUB_UNSTARTED),
        withLatestFrom(this.store.select<BaseSignalRStoreState>(<string>this.stateKey).pipe(map(state => state.hubs))),
        mergeMap(([action, hubs]) => {
            const hub = hubs.filter(h => h.hubName === action.hubName && h.url === action.url)[0];

            const start$ = hub.start$.pipe(
                map(_ => ({ type: SIGNALR_HUB_STARTED, hubName: action.hubName, url: action.url })),
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

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        @Inject(SIGNALR_CONFIG) private config: StoreSignalRConfig
    ) {
        this.stateKey = this.config.stateKey as StateKeyOrSelector;
    }
}