import io from 'socket.io-client';
import eventBus from './event-bus';
import pushConfig from '../constants/push-config';
import eventConfig from '../constants/event-config';

let _connection = null;

/**
 * Opens a new connection to the Socket
 */
function openConnection() {
    if (!_connection) {
        _connection = io(pushConfig.endpoint);
        _connection.on('connect', onConnect);
        _connection.on('disconnect', onDisconnect);
        _connection.on('error', onError);
    }
}

/**
 * Callback for socket connect event
 */
function onConnect() {
    console.log(`Socket connection established, joining region ${pushConfig.region}`);
    _connection.emit(pushConfig.events.joinRegion, pushConfig.region);
    _connection.on(pushConfig.events.newMessage, onNewMessage);
}

/**
 * Callback for socket disconnect event
 */
function onDisconnect() {
    console.log('Disconnected from socket');
}

/**
 * Callback for socket error event
 * @param  {Object} error
 */
function onError(error) {
    console.log('Error with socket connection', error);
}

/**
 * Custom callback for socket new-message event
 * @param  {Object} message
 */
function onNewMessage(message) {
    console.log('Socket message received', message);
    eventBus.$emit(eventConfig.newBid, message);
}

/**
 * Closes the connection to the socket
 */
function closeConnection() {
    if (_connection) {
        _connection.close();
    }
}

export default { openConnection, closeConnection };
