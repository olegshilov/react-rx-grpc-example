import { Observable, interval } from 'rxjs';
import { EchoState } from './echoReducer';
import {
  EchoAction,
  PING,
  PING_STREAM,
  PING_STOP,
  PONG,
  GRPC_ECHO,
  GRPC_ECHO_STREAM,
  GRPC_ECHO_STOP,
  GRPC_ECHO_RESPONSE,
} from './echoActions';
import { ofType } from '../offType';
import { combineEpics } from '../combineEpics';
import { Epic } from '../useEpicReducer';
import {
  mapTo,
  withLatestFrom,
  tap,
  delay,
  switchMap,
  takeUntil,
  map,
} from 'rxjs/operators';

import { EchoService } from './EchoService';

export function createEchoRootEpic({
  echoService,
}: {
  echoService: EchoService;
}): Epic<EchoState, EchoAction> {
  function ping(action$: Observable<EchoAction>): Observable<EchoAction> {
    return action$.pipe(ofType(PING), mapTo({ type: PONG }));
  }

  function pingStream(action$: Observable<EchoAction>): Observable<EchoAction> {
    return action$.pipe(
      ofType(PING_STREAM),
      switchMap(() =>
        interval(1000).pipe(takeUntil(action$.pipe(ofType(PING_STOP))))
      ),
      mapTo({ type: PONG })
    );
  }

  function grpcEcho(action$: Observable<EchoAction>): Observable<EchoAction> {
    return action$.pipe(
      ofType(GRPC_ECHO),
      switchMap((action) => echoService.echo(action.payload)),
      map((response) => ({
        type: GRPC_ECHO_RESPONSE,
        payload: response,
      }))
    );
  }

  function grpcEchoStream(
    action$: Observable<EchoAction>
  ): Observable<EchoAction> {
    return action$.pipe(
      ofType(GRPC_ECHO_STREAM),
      switchMap((action) => {
        return echoService
          .echoStream(action.payload)
          .pipe(takeUntil(action$.pipe(ofType(GRPC_ECHO_STOP))));
      }),
      map((response) => ({
        type: GRPC_ECHO_RESPONSE,
        payload: response,
      }))
    );
  }

  return combineEpics(ping, pingStream, grpcEcho, grpcEchoStream);
}
