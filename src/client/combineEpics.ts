import { Observable, merge } from 'rxjs';
import { Action, Epic } from './useEpicReducer';

/**
  Merges all epics into a single one.
 */
export function combineEpics<S, A extends Action>(
  ...epics: Array<Epic<S, A>>
): Epic<S, A> {
  const merger = (action: Observable<A>, state: Observable<S>): Observable<A> =>
    merge(
      ...epics.map((epic) => {
        const output$ = epic(action, state);
        if (!output$) {
          throw new TypeError(
            `combineEpics: one of the provided Epics "${
              epic.name || '<anonymous>'
            }" does not return a stream.\nDouble check you're not missing a return statement!`,
          );
        }
        return output$;
      }),
    );

  // Technically the `name` property on Function's are supposed to be read-only.
  // While some JS runtimes allow it anyway (so this is useful in debugging)
  // some actually throw an exception when you attempt to do so.
  try {
    Object.defineProperty(merger, 'name', {
      value: `combineEpics(${epics
        .map((epic) => epic.name || '<anonymous>')
        .join(', ')})`,
    });
  } catch (e) {
    console.error(e);
  }

  return merger;
}
