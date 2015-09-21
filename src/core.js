import Immutable from 'immutable';
import {Map, List} from 'immutable';

/* Loads the state with a list of `entries` to vote on. */
export function setEntries(state, entries) {
    return state.set('entries', List(entries));
}

/* Given the current pair of entries being voted on, find the winner. */
function _getWinners(vote) {
    if (!vote) { return List(); }

    const [a, b] = vote.get('pair');  // Similar to Python's unpack.

    // A safer way than calling `vote.tally.a` - this won't cause exceptions.
    const aVotes = vote.getIn(['tally', a], 0);
    const bVotes = vote.getIn(['tally', b], 0);

    if (aVotes > bVotes) {
        return a;
    } else if (aVotes < bVotes) {
        return b;
    } else {
        return List([a, b]);
    }
}

/* Determines what the next pair of "things" to vote for are. */
export function next(state) {
    // Get the queued of entries list and add the winner from the current pair.
    const entries = state.get('entries').concat(_getWinners(state.get('vote')));

    // NOTE: The following won't work:
    //
    // ```
    // const entries = state.get('entries');
    // entries.concat(...);
    // ```
    //
    // 1. `const entries` is a constant reference to state.get('entries');
    // 2. `concat(...)` creates a *new* version of state.get('entries');
    // 3. `const entries` still references the original entries (not the updated).

    return Immutable.fromJS({
        vote: { pair: entries.take(2) },
        entries: entries.skip(2)
    });
}

/* Vote on the `entry` given `pair` of entries in the state. */
export function vote(state, entry) {
    // How does this work?
    //
    // Find `entry` inside the nested `tally` object (creating tally if it doesn't
    // exist). If `entry` doesn't exist, set the default to `0`, otherwise call
    // the anonymous function `tally => tally + 1`.
    return state.updateIn(
        ['vote', 'tally', entry],
        0,
        tally => tally + 1
    );
}
