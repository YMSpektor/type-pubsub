import { PubSubService } from "./pubsub-service.type";

/**
 * Message handler function.
 * Example usage:
 * ```
 * PubSub.subscribe('TEST_MESSAGE', (data, message, channel, handler) => {
 *   console.log(data);
 * });
 * ```
 */
export type MessageHandler<DataType, MessageType> = (
    data: DataType,
    message: MessageType,
    channel: PubSubService<MessageType>,
    handler: MessageHandler<DataType, MessageType>
) => void;