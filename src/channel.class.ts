import { MessageHandler } from "./types/message-handler.type";
import { PubSubService } from "./types/pubsub-service.type";

export class Channel<MessageType> implements PubSubService<MessageType> {
    private subscriptions = new Map<MessageType, MessageHandler<any, MessageType>[]>();

    publish<T>(message: MessageType, data: T) {
        let handlers = this.subscriptions.get(message);
        if (handlers) {
            handlers.forEach(handler => {
                handler(data, message);
            });
        }
    }

    subscribe<T>(message: MessageType, handler: MessageHandler<T, MessageType>) {
        let handlers = this.subscriptions.get(message);
        if (!handlers) {
            handlers = [];
            this.subscriptions.set(message, handlers);
        }
        handlers.push(handler);
    }

    unsubscribe<T>(message: MessageType, handler: MessageHandler<T, MessageType>) {
        let handlers = this.subscriptions.get(message);
        if (handlers) {
            handlers = handlers.filter(x => x !== handler);
            if (handlers.length) {
                this.subscriptions.set(message, handlers);
            }
            else {
                this.subscriptions.delete(message);
            }
        }
    }

    unsubscribeAll() {
        this.subscriptions.clear();
    }
}