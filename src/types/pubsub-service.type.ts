import { MessageHandler } from "./message-handler.type";

export interface PubSubService<MessageType> {
    /**
     * Publishes a message to a pubsub channel
     * @param message - a type of message to publish
     * @param data - message payload
     */
    publish<T>(message: MessageType, data: T): void;
    /**
     * Adds the handler function to a chain of handlers that will be called when a message of the given type will be published
     * @param message - a type of the message to subscribe to
     * @param handler - the handler function
     */
    subscribe<T>(message: MessageType, handler: MessageHandler<T, MessageType>): void;
    /**
     * Removes the handler function from the chain of handlers. The handler function will be stop called when events of the given type are published
     * @param message - the type of the message that the handler is subscribed to
     * @param handler - the handler function
     */
    unsubscribe<T>(message: MessageType, handler: MessageHandler<T, MessageType>): void;
}