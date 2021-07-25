import { MessageHandler } from "./message-handler.type";

export type SubscriptionMetadata<MessageType> = {
    message: MessageType;
    handler: MessageHandler<unknown, MessageType>;
}