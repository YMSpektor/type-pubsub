import { SUBSCRIPTIONS_METADATA_KEY } from "../consts/metadata-keys.consts";
import { SubscriptionMetadata } from "../types/subscription-metadata.type";

/**
 * Marks a method as a message handler. The method can have the following signature: (data, message, channel, handler) => void, where
 * - data - a message specific data passed by a publisher
 * - message - the message code
 * - channel - the instance of `PubSubService` that published the message
 * - handler - the reference to the handler function, can be used for unsubscription
 * @param message - the message to subscribe to
 */
export function Subscribe<T>(message: T): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const subscriptions = Reflect.getMetadata(SUBSCRIPTIONS_METADATA_KEY, target) as Set<SubscriptionMetadata<T>> || new Set<SubscriptionMetadata<T>>();
        subscriptions.add({ message, handler: descriptor.value });
        Reflect.defineMetadata(SUBSCRIPTIONS_METADATA_KEY, subscriptions, target);
    }
}