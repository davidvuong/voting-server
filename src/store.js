import {createStore} from 'redux';
import reducer from './reducer';

// Creates a Redux Store (1 Store per application). It's the central point of our
// application, holding the current and past states.
export default function makeStore() {
    return createStore(reducer);
}
