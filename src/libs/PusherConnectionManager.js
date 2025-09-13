"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
const Session_1 = require("./actions/Session");
const Log_1 = require("./Log");
const Pusher_1 = require("./Pusher");
function init() {
    /**
     * When authTokens expire they will automatically be refreshed.
     * The authorizer helps make sure that we are always passing the
     * current valid token to generate the signed auth response
     * needed to subscribe to Pusher channels.
     */
    Pusher_1.default.registerCustomAuthorizer?.((channel) => ({
        authorize: (socketId, callback) => {
            (0, Session_1.authenticatePusher)(socketId, channel.name, callback);
        },
    }));
    Pusher_1.default.registerSocketEventCallback((eventName, error) => {
        switch (eventName) {
            case 'error': {
                if (error && 'type' in error) {
                    const errorType = error?.type;
                    const code = error?.data?.code;
                    const errorMessage = error?.data?.message ?? '';
                    if (errorType === CONST_1.default.ERROR.PUSHER_ERROR && code === 1006) {
                        // 1006 code happens when a websocket connection is closed. There may or may not be a reason attached indicating why the connection was closed.
                        // https://datatracker.ietf.org/doc/html/rfc6455#section-7.1.5
                        Log_1.default.hmmm('[PusherConnectionManager] Channels Error 1006', { error });
                        // The 1006 errors don't always have a message, but when they do, it seems that it prevents the pusher client from reconnecting.
                        // On the advice from Pusher directly, they suggested to manually reconnect in those scenarios.
                        if (errorMessage) {
                            Log_1.default.hmmm('[PusherConnectionManager] Channels Error 1006 message', { errorMessage });
                            Pusher_1.default.reconnect();
                        }
                    }
                    else if (errorType === CONST_1.default.ERROR.PUSHER_ERROR && code === 4201) {
                        // This means the connection was closed because Pusher did not receive a reply from the client when it pinged them for a response
                        // https://pusher.com/docs/channels/library_auth_reference/pusher-websockets-protocol/#4200-4299
                        Log_1.default.hmmm('[PusherConnectionManager] Pong reply not received', { error });
                    }
                    else if (errorType === CONST_1.default.ERROR.WEB_SOCKET_ERROR) {
                        // It's not clear why some errors are wrapped in a WebSocketError type - this error could mean different things depending on the contents.
                        Log_1.default.hmmm('[PusherConnectionManager] WebSocketError', { error });
                    }
                    else {
                        Log_1.default.alert(`${CONST_1.default.ERROR.ENSURE_BUG_BOT} [PusherConnectionManager] Unknown error event`, { error });
                    }
                }
                break;
            }
            case 'connected':
                Log_1.default.hmmm('[PusherConnectionManager] connected event');
                break;
            case 'disconnected':
                Log_1.default.hmmm('[PusherConnectionManager] disconnected event');
                break;
            case 'state_change':
                Log_1.default.hmmm('[PusherConnectionManager] state change', { states: error });
                break;
            default:
                Log_1.default.hmmm('[PusherConnectionManager] unhandled event', { eventName });
                break;
        }
    });
}
exports.default = {
    init,
};
