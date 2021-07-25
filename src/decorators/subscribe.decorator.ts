import { SUBSCRIPTIONS_METADATA_KEY } from "../consts/metadata-keys.consts";
import { SubscriptionMetadata } from "../types/subscription-metadata.type";

export function Subscribe<T>(message: T): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const subscriptions = Reflect.getMetadata(SUBSCRIPTIONS_METADATA_KEY, target) as Set<SubscriptionMetadata<T>> || new Set<SubscriptionMetadata<T>>();
        subscriptions.add({ message, handler: descriptor.value });
        Reflect.defineMetadata(SUBSCRIPTIONS_METADATA_KEY, subscriptions, target);
    }
}