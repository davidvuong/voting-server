import Immutable from 'immutable';

import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {
    describe('setEntries', () => {
        it('add entries to the state', () => {
            const state = Map();  // const reference, not value.
            const entries = List(['David', 'Denise']);
            const nextState = setEntries(state, entries);

            expect(nextState).to.equal(Immutable.fromJS({
                entries: ['David', 'Denise']
            }));
        });
    });

    describe('next', () => {
        it('takes the next pair of entries to vote on', () => {
            const state = Immutable.fromJS({
                entries: ['David', 'Denise']
            });
            const nextState = next(state);

            expect(nextState).to.equal(Immutable.fromJS({
                vote: {
                    pair: ['David', 'Denise']
                },
                entries: []
            }));
        });

        it('iterates to the next pair of entries to vote on', () => {
            const state = Immutable.fromJS({
                vote: {
                    pair: ['David', 'Denise'],
                    tally: { 'David': 1 }
                },
                entries: ['Bob', 'Kevin', 'Steve']
            });
            const nextState = next(state);

            expect(nextState).to.equal(Immutable.fromJS({
                vote: {
                    pair: ['Bob', 'Kevin']
                },
                entries: ['Steve', 'David']
            }));
        });

        it('put back into entries list when tied', () => {
            const state = Immutable.fromJS({
                vote: {
                    pair: ['David', 'Denise'],
                    tally: { 'David': 1, 'Denise': 1 }
                },
                entries: ['Bob', 'Kevin', 'Steve']
            });
            const nextState = next(state);

            expect(nextState).to.equal(Immutable.fromJS({
                vote: {
                    pair: ['Bob', 'Kevin']
                },
                entries: ['Steve', 'David', 'Denise']
            }));
        });
    });

    describe('vote', () => {
        it('creates a tally when one does not exist', () => {
            const state = Immutable.fromJS({
                vote: {
                    pair: ['David', 'Denise']
                },
                entries: []
            });
            const nextState = vote(state, 'David');

            expect(nextState).to.equal(Immutable.fromJS({
                vote: {
                    pair: ['David', 'Denise'],
                    tally: { 'David': 1 }
                },
                entries: []
            }));
        });

        it('adds to an existing tally if it already exists', () => {
            const state = Immutable.fromJS({
                vote: {
                    pair: ['David', 'Denise'],
                    tally: { 'David': 5, 'Denise': 3 }
                },
                entries: []
            });
            const nextState = vote(state, 'Denise');

            expect(nextState).to.equal(Immutable.fromJS({
                vote: {
                    pair: ['David', 'Denise'],
                    tally: { 'David': 5, 'Denise': 4 }
                },
                entries: []
            }));
        });
    });
});