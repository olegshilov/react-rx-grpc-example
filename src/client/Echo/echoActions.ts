import { Action, Dispatch } from '../useEpicReducer';

export enum EchoActionTypes {
  PING = 'PING',
  PING_STREAM = 'PING_STREAM',
  PING_STOP = 'PING_STOP',
  PONG = 'PONG',
  GRPC_ECHO = 'GRPC_ECHO',
  GRPC_ECHO_STREAM = 'GRPC_ECHO_STREAM',
  GRPC_ECHO_STOP = 'GRPC_ECHO_STOP',
  GRPC_ECHO_RESPONSE = 'GRPC_ECHO_RESPONSE',
}

export interface EchoActions {
  ping: () => void;
  pingStream: () => void;
  pingStop: () => void;
  grpcEcho: () => void;
  grpcEchoStream: () => void;
  grpcEchoStop: () => void;
}

export type EchoAction =
  | Action<typeof EchoActionTypes.PING>
  | Action<typeof EchoActionTypes.PING_STREAM>
  | Action<typeof EchoActionTypes.PING_STOP>
  | Action<typeof EchoActionTypes.PONG>
  | Action<typeof EchoActionTypes.GRPC_ECHO>
  | Action<typeof EchoActionTypes.GRPC_ECHO_STREAM>
  | Action<typeof EchoActionTypes.GRPC_ECHO_STOP>
  | Action<typeof EchoActionTypes.GRPC_ECHO_RESPONSE>;

export function createEchoActions(dispatch: Dispatch<EchoAction>): EchoActions {
  return {
    ping: (): void => dispatch({ type: EchoActionTypes.PING }),
    pingStream: (): void => dispatch({ type: EchoActionTypes.PING_STREAM }),
    pingStop: (): void => dispatch({ type: EchoActionTypes.PING_STOP }),
    grpcEcho: (): void => {
      return dispatch({ type: EchoActionTypes.GRPC_ECHO, payload: 'echo' });
    },
    grpcEchoStream: (): void => {
      return dispatch({
        type: EchoActionTypes.GRPC_ECHO_STREAM,
        payload: 'stream echo',
      });
    },
    grpcEchoStop: (): void =>
      dispatch({ type: EchoActionTypes.GRPC_ECHO_STOP }),
  };
}
