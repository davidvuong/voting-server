import {Map, fromJS} from 'immutable';
import {expect} from 'chai';
import reducer from '../src/reducer';

describe('reducer', () => {
    it('handles SET_ENTRIES', () => {
        const initialState = Map();
        const action = { type: 'SET_ENTRIES', entries: ['David', 'Denise'] };

        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            entries: ['David', 'Denise']
        }));
    });

    it('handles NEXT', () => {
        const initialState = fromJS({
            entries: ['David', 'Denise']
        });
        const action = { type: 'NEXT' };

        const nextState = reducer(initialState, action);
        expect(nextState).to.equal(fromJS({
            vote: {
                pair: ['David', 'Denise']
            },
            entries: []
        }));
    });

    it('handles VOTE', () => {
        const initialState = fromJS({
            vote: {
                pair: ['David', 'Denise']
            },
            entries: []
        });
        const action = { type: 'VOTE', entry: 'David' };

        const nextState = reducer(initialState, action);
        expect(nextState).to.equal(fromJS({
            vote: {
                pair: ['David', 'Denise'],
                tally: { 'David': 1 }
            },
            entries: []
        }));
    });

    it('sets an initial state if state is undefined', () => {
        const action = { type: 'SET_ENTRIES', entries: ['David', 'Denise'] };
        const nextState = reducer(undefined, action);

        expect(nextState).to.equal(fromJS({
            entries: ['David', 'Denise']
        }));
    });

    it('plays the voting game with reduce', () => {
        // NOTE: Redux expects actions to be normal objects (not immutable).
        const actions = [
            { type: 'SET_ENTRIES', entries: ['David', 'Denise'] },
            { type: 'NEXT' },
            { type: 'VOTE', entry: 'David' },
            { type: 'VOTE', entry: 'Denise' },
            { type: 'VOTE', entry: 'David' },
            { type: 'NEXT' }
        ];
        const nextState = actions.reduce(reducer, Map());
        expect(nextState).to.equal(fromJS({
            winner: 'David'
        }));
    });
});
