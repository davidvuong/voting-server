import makeStore from './store';
import startServer from './server';

// The entry point of our application, init the Redux store.
export const store = makeStore();

// Passing `store` into `startServer` so we can integrate Socket.io with Redux.
startServer(store);

// Initialise the store with some entries and start the voting process.
store.dispatch({
    type: 'SET_ENTRIES',
    entries: require('../assets/entries.json')
});
store.dispatch({ type: 'NEXT' });
