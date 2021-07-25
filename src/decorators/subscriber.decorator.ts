import { CHANNEL_METADATA_KEY, SUBSCRIPTIONS_METADATA_KEY } from "../consts/metadata-keys.consts";
import { SubscriptionMetadata } from "../types/subscription-metadata.type";
import { PubSub } from "../consts/pubsub.const";
import { PubSubService } from "../types/pubsub-service.type";

export function Subscriber(pubsub?: PubSubService<any>): ClassDecorator {
    pubsub = pubsub || PubSub;
    return function(target) {
        Reflect.defineMetadata(CHANNEL_METADATA_KEY, pubsub, target.prototype);
        
        const newConstructor: any = function (...args: any[]) {
            const targetConstructor: any = target;
            const instance = new targetConstructor(...args);
            const subscriptions: SubscriptionMetadata<unknown>[] | undefined = Reflect.getMetadata(SUBSCRIPTIONS_METADATA_KEY, target.prototype);
            if (subscriptions) {
                const handlers: SubscriptionMetadata<unknown>[] = [];
                Reflect.defineMetadata(SUBSCRIPTIONS_METADATA_KEY, handlers, instance);
                subscriptions.forEach(subscription => {
                    const handler = subscription.handler.bind(instance);
                    handlers.push({message: subscription.message, handler});
                    pubsub!.subscribe(subscription.message, handler);
                });
            }
            return instance;
        }

        newConstructor.prototype = target.prototype;
        return newConstructor;
    }
}