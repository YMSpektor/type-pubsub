import { MessageHandler } from "./message-handler.type";

/**
 * Type description for internal subscription metadata
 */
export type SubscriptionMetadata<MessageType> = {
    message: MessageType;
    handler: MessageHandler<unknown, MessageType>;
}