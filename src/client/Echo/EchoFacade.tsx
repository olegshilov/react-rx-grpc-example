import React, { createContext, ReactElement, useContext, useMemo } from 'react';
import { useEpicReducer } from '../useEpicReducer';
import { combineEpics } from '../combineEpics';
import { createEchoActions, EchoActions } from './echoActions';
import { echoReducer, ECHO_INITIAL_STATE, EchoState } from './echoReducer';
import { createEchoRootEpic } from './echoEpics';
import { useEchoService } from './EchoService';

export const EchoStateContext = createContext<EchoState>(ECHO_INITIAL_STATE);
export const EchoActionsContext = createContext<EchoActions | void>(undefined);

function useEchoFacade(): [EchoState, EchoActions] {
  const echoService = useEchoService();
  const echoRootEpic = useMemo(() => {
    return createEchoRootEpic({ echoService });
  }, [echoService]);
  const [state, dispatch] = useEpicReducer(
    echoReducer,
    ECHO_INITIAL_STATE,
    combineEpics(echoRootEpic)
  );
  const actions = useMemo(() => {
    return createEchoActions(dispatch);
  }, [dispatch]);

  // NOTE: you can init service here in effect

  return [state, actions];
}

export function EchoFacade({
  children,
}: {
  children: ReactElement;
}): ReactElement {
  const [state, actions] = useEchoFacade();

  return (
    <EchoStateContext.Provider value={state}>
      <EchoActionsContext.Provider value={actions}>
        {children}
      </EchoActionsContext.Provider>
    </EchoStateContext.Provider>
  );
}

export function useEchoState(): EchoState {
  const state = useContext(EchoStateContext);

  return state;
}

export function useEchoActions(): EchoActions {
  const actions = useContext(EchoActionsContext);

  if (!actions) {
    throw new Error(
      'useEchoActions() should be used inside EchoActionsContext'
    );
  }

  return actions;
}
