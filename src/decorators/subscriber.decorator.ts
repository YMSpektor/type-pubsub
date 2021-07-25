import { CHANNEL_METADATA_KEY, SUBSCRIPTIONS_METADATA_KEY } from "../consts/metadata-keys.consts";
import { SubscriptionMetadata } from "../types/subscription-metadata.type";
import { PubSub } from "../consts/pubsub.const";
import { PubSubService } from "../types/pubsub-service.type";

export interface SubscriberConfig {
    channel?: PubSubService<any>;
    createInstance?: boolean;
    constructorParameters?: any[];
}

export function Subscriber(config?: SubscriberConfig): ClassDecorator {
    const channel = config?.channel || PubSub;
    return function(target) {
        Reflect.defineMetadata(CHANNEL_METADATA_KEY, channel, target.prototype);
        
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
                    channel.subscribe(subscription.message, handler);
                });
            }
            return instance;
        }

        newConstructor.prototype = target.prototype;

        if (config?.createInstance) {
            new newConstructor(config.constructorParameters);
        }

        return newConstructor;
    };
}