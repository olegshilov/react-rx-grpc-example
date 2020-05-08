import { EchoAction, PONG, GRPC_ECHO_RESPONSE } from './echoActions';

export const ECHO_INITIAL_STATE: EchoState = { epic: 0, grpc: 'initial' };

export type EchoState = {
  epic: number;
  grpc: string;
};

export function echoReducer(
  state: EchoState = ECHO_INITIAL_STATE,
  action: EchoAction
): EchoState {
  switch (action.type) {
    case PONG:
      return {
        ...state,
        epic: state.epic + 1,
      };

    case GRPC_ECHO_RESPONSE:
      return {
        ...state,
        grpc: action.payload,
      };

    default:
      return state;
  }
}
