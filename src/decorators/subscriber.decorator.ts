import { CHANNEL_METADATA_KEY, SUBSCRIPTIONS_METADATA_KEY } from "../consts/metadata-keys.consts";
import { SubscriptionMetadata } from "../types/subscription-metadata.type";
import { PubSub } from "../consts/pubsub.const";
import { PubSubService } from "../types/pubsub-service.type";

export interface SubscriberConfig {
    /**
     * Specifies the channel to subscribe. The default `PubSub` channel will be used if not specified
     */
    channel?: PubSubService<any>;
    /**
     * If true, a single instance of this class will be created automatically. 
     * You can specify constructor parameters to create this instance in the `constructorParameters` field
     */
    createInstance?: boolean;
    /**
     * Constructor parameters to create a instance of the class if `createInstance` property is true
     */
    constructorParameters?: any[];
}

/**
 * Marks class as a Subscriber. Instances of this will be automatically subscribed to a message channel
 * @param config Subscriber configuration
 */
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