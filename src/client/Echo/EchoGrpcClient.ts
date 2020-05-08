import * as grpcWeb from 'grpc-web';
import {
  EchoRequest,
  EchoResponse,
  ServerStreamingEchoRequest,
  ServerStreamingEchoResponse,
} from '../grpc/echo_pb';
import { EchoServiceClient } from '../grpc/EchoServiceClientPb';
import { useMemo, useCallback } from 'react';
import { Observable } from 'rxjs';

export interface EchoGprcClient {
  echo: (text: string) => Observable<string>;
  echoStream: (text: string) => Observable<string>;
}

export function useEchoGrpcClient(): EchoGprcClient {
  const client = useMemo(
    () => new EchoServiceClient('http://localhost:8080', null, null),
    []
  );

  const echo = useCallback(
    (text: string) => {
      return new Observable<string>((observer) => {
        const echoRequest = new EchoRequest();
        echoRequest.setMessage(text);

        client.echo(
          echoRequest,
          {},
          (err: grpcWeb.Error, response: EchoResponse) => {
            if (err) {
              if (err.code !== grpcWeb.StatusCode.OK) {
                observer.error(
                  'Error code: ' + err.code + ' "' + err.message + '"'
                );
              }
            } else {
              console.log(response.getMessage());
              observer.next(response.getMessage());
            }
            observer.complete();
          }
        );
      });
    },
    [client]
  );

  const echoStream = useCallback(
    (text: string) => {
      const streamRequest = new ServerStreamingEchoRequest();
      streamRequest.setMessage(text);
      streamRequest.setMessageInterval(1000);
      streamRequest.setMessageCount(100);

      const stream = client.serverStreamingEcho(streamRequest, {});

      const streamObservable = new Observable<string>((observer) => {
        stream.on('data', (response: ServerStreamingEchoResponse) => {
          console.log(response.getMessage());
          observer.next(response.getMessage());
        });

        stream.on('end', () => {
          observer.complete();
        });
      });

      // streamObservable.subscribe({ next: console.log });

      return streamObservable;
    },
    [client]
  );

  return {
    echo,
    echoStream,
  };
}
