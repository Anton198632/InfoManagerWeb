import { IS_DEBUG } from "../settings/settings";

export const useWebSocketService = () => {

    let messHandler = () => {}

    let address = `${window.location.hostname}:${window.location.port}`;
    if (IS_DEBUG)
        address = 'localhost:8000'


    let connectionString = 'ws://' + address + '/ws/event/' + 2 + '/';
    let socket = new WebSocket(connectionString);

    
    const onMessageHandler = (e) => {
        let data = JSON.parse(e.data);
        const newKey = parseInt(data.event.event)
            if (newKey){
                messHandler(newKey);
            }
    }

    const setMessageHandler = (messageHandler) => {
        messHandler = messageHandler;
    }


    const connect = () => {
        socket.onopen = function open() {
            console.log('WebSockets connection created.');
            // on websocket open, send the START event.
            socket.send(JSON.stringify({
                "event": "START",
                "message": ""
            }));
        };

        socket.onclose = function (e) {
            console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(function () {
                connect();
            }, 1000);
        };
        // Sending the info about the room
        socket.onmessage = onMessageHandler;

        if (socket.readyState == WebSocket.OPEN) {
            socket.onopen();
        }
    }

    return {connect, setMessageHandler}


}