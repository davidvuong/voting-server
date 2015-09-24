import Server from 'socket.io';

// Creates a Socket.io server and HTTP server bound to port 8090.
export default function startServer(store) {
    const io = new Server().attach(8090);

    // Attach a listener to the store.
    //
    // Whenever the store is changed, get the current state, convert it into
    // JSON and send it over Socket.io
    //
    // This is a bit problematic for larger applications as this emits the entire
    // store causing large data transfers.
    store.subscribe(
        // *ALL* connected clients will get the updated state.
        () => io.emit('state', store.getState().toJS())
    );

    // When a client connects to the server, give them the complete state.
    //
    // This lets the client sync up with the server.
    io.on('connection', (socket) => {
        socket.emit('state', store.getState().toJS());

        // When the server receives actions from the client, send that off to
        // the Redux dispatcher.
        //
        // How does `store.dispatch.bind(store)` work?
        //
        // I'm not 100% but I think the `.bind` is just your typical JavaScript
        // `.bind`. Perhaps `dispatch` looks at `this` as the `store` when updating
        // the tree. `.bind` updates `this` to use our `store`.
        //
        // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
        //
        // NOTE: There are security problems here as we're allowing any client to
        // dispatch *any* action.
        socket.on('action', store.dispatch.bind(store));
    });
}
