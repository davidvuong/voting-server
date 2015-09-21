import {expect} from 'chai';
import {List, Map} from 'immutable';

describe('immutability', () => {
    describe('a number', () => {
        function increment(currentState) {
            return currentState + 1;
        }

        it('is immutable', () => {
            let state = 42;
            let nextState = increment(state);

            expect(state).to.equal(42);
            expect(nextState).to.equal(43);
        });
    });

    describe('a list', () => {
        function addSeries(currentState, series) {
            return currentState.push(series);
        }

        it('is immutable', () => {
            let state = List.of('Suits', 'How I Met Your Mother');
            let nextState = addSeries(state, 'The Originals');

            expect(state).to.equal(List.of('Suits', 'How I Met Your Mother'));
            expect(nextState).to.equal(List.of(
                'Suits', 'How I Met Your Mother', 'The Originals'
            ));
        });
    });

    describe('a tree', () => {
        function addMovie(currentState, movie) {
            return currentState.update('movies', movies => movies.push(movie));
        }

        it('is immutable', () => {
            let state = Map({
                movies: List.of('A Beautiful Mind', 'Fight Club')
            });
            let nextState = addMovie(state, 'The Avengers');

            expect(state).to.equal(Map({
                movies: List.of('A Beautiful Mind', 'Fight Club')
            }));
            expect(nextState).to.equal(Map({
                movies: List.of('A Beautiful Mind', 'Fight Club', 'The Avengers')
            }));
        });
    });
});
