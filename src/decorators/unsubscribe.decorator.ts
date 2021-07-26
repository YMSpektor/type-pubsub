import { CHANNEL_METADATA_KEY, SUBSCRIPTIONS_METADATA_KEY } from "../consts/metadata-keys.consts";
import { SubscriptionMetadata } from "../types/subscription-metadata.type";
import { PubSubService } from "../types/pubsub-service.type";

/**
 * Wraps the function with the logic to unsubscribe the class instance from a pubsub service, the function can be called manually if you need to stop observation
 */
export function Unsubscribe(): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const targetMethod = descriptor.value;

        descriptor.value = function(...args: any[]): any {
            const pubsub: PubSubService<unknown> | undefined = Reflect.getMetadata(CHANNEL_METADATA_KEY, target);
            const subscriptions = Reflect.getMetadata(SUBSCRIPTIONS_METADATA_KEY, this) as SubscriptionMetadata<unknown>[] | undefined;
            if (pubsub && subscriptions) {
                subscriptions.forEach(subscription => {
                    pubsub.unsubscribe(subscription.message, subscription.handler);
                });
            }

            return targetMethod(args);
        }

        return descriptor;
    }
}
