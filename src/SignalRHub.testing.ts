import { ISignalRHub } from "./SignalRHub.interface";
import { Subject, Observable, timer } from "rxjs";

export abstract class SignalRTestingHub implements ISignalRHub {
    private _startSubject = new Subject<void>();
    private _stopSubject = new Subject<void>();
    private _stateSubject = new Subject<string>();
    private _errorSubject = new Subject<SignalR.ConnectionError>();
    private _subjects: { [eventName: string]: Subject<any> } = {};

    start$: Observable<void>;

    stop$: Observable<void>;

    state$: Observable<string>;
    error$: Observable<SignalR.ConnectionError>;

    options?: SignalR.ConnectionOptions;

    constructor(public hubName: string, public url?: string) {
        this.start$ = this._startSubject.asObservable();
        this.stop$ = this._startSubject.asObservable();
        this.state$ = this._stateSubject.asObservable();
        this.error$ = this._errorSubject.asObservable();
    }

    start(): Observable<void> {
        timer(100).subscribe(_ => {
            this._startSubject.next();
            this._stateSubject.next('connected');
        });

        return this._startSubject.asObservable();
    }

    stop(async?: boolean, notifyServer?: boolean): Observable<void> {
        timer(100).subscribe(_ => {
            this._stopSubject.next();
            this._stateSubject.next('disconnected');
        });

        return this._stopSubject.asObservable();
    }

    abstract on<T>(eventName: string): Observable<T>;

    abstract send(methodName: string, ...args: any[]): Observable<any>;

    hasSubscriptions(): boolean {
        for (let key in this._subjects) {
            if (this._subjects.hasOwnProperty(key)) {
                return true;
            }
        }

        return false;
    }
}