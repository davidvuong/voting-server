import {Map, fromJS} from 'immutable';
import {setEntries, vote, next, INITIAL_STATE} from './core';

// NOTE:
//
// Reducers are required to be able to be called with an undefined state. The
// initial state is then set implicitly by the reducer function.
export default function reducer(state = INITIAL_STATE, action = Map()) {
    switch (action.type) {
        case 'SET_ENTRIES':
            return setEntries(state, action.entries);
        case 'NEXT':
            return next(state);
        case 'VOTE':
            // How does this work?
            //
            // The `state` passed into `vote()` isn't the complete tree, it's
            // only the `vote = { pair: ..., tally: ... }` subtree (note: the
            // state passed into `reducer` is the complete tree).
            //
            // See: https://facebook.github.io/immutable-js/docs/#/Map
            //
            // It's the same as saying...
            // ```
            // const voteState = state.get('vote');
            // const nextVoteState = vote(voteState, action.entry);
            // const nextState = state.set('vote', nextVoteState);
            // return nextState;
            // ```
            //
            // When passing the state into the reducer, the entire state object
            // is passed. However, when it comes to invoking specific functions,
            // the reducer will only pass in portions of the state tree to the
            // invoked functions.
            return state
                .update('vote', voteState => vote(voteState, action.entry));
        default:
            return state;
    }
}
