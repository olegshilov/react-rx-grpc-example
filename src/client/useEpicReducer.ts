import {
  Observable,
  Subject,
  merge,
  OperatorFunction,
  queueScheduler,
} from 'rxjs';
import { useState, useLayoutEffect, useMemo, useCallback } from 'react';
import {
  filter,
  observeOn,
  distinctUntilChanged,
  startWith,
  scan,
  shareReplay,
  share,
} from 'rxjs/operators';

export declare interface Action<T = any, P = any> {
  type: T;
  payload?: P;
}

export declare interface Dispatch<A extends Action> {
  (action: A): void;
}

export declare interface Reducer<S, A extends Action> {
  (state: S, action: A): S;
}

export declare interface Epic<S, A extends Action> {
  (action$: Observable<A>, state$: Observable<S>): Observable<A>;
}

export function useEpicReducer<S, A extends Action>(
  reducer: Reducer<S, A>,
  initialState: S,
  rootEpic: Epic<S, A>
): [S, Dispatch<A>] {
  const [state, setState] = useState<S>(initialState);
  const action$ = useMemo(() => {
    return new Subject<A>();
  }, []);
  const state$ = useMemo(() => {
    return action$
      .pipe(
        scan(reducer, initialState),
        startWith(initialState),
        distinctUntilChanged(),
        shareReplay(1)
      )
      .pipe();
  }, [action$, initialState, reducer]);
  const epic$ = useMemo(() => {
    return rootEpic(action$, state$).pipe(share());
  }, []);

  const dispatch = useCallback(
    (action: A): void => {
      action$.next(action);
    },
    [action$]
  );

  useLayoutEffect(() => {
    const stateSubscription = state$.subscribe({
      next: (state: S) => {
        setState(state);
      },
      error: console.error, // TODO: add logger
    });

    return (): void => {
      stateSubscription.unsubscribe();
    };
  }, [state$]);

  useLayoutEffect(() => {
    const epicSubscription = epic$.subscribe({
      next: (action: A) => {
        dispatch(action);
      },
      error: console.error, // TODO: add logger
    });

    return (): void => {
      epicSubscription.unsubscribe();
    };
  }, [epic$, dispatch]);

  return [state, dispatch];
}
