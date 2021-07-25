import { MessageHandler } from "./message-handler.type";

export interface PubSubService<MessageType> {
    publish<T>(message: MessageType, data: T): void;
    subscribe<T>(message: MessageType, handler: MessageHandler<T, MessageType>): void;
    unsubscribe<T>(message: MessageType, handler: MessageHandler<T, MessageType>): void;
}