import 'reflect-metadata';
import { PubSub, Subscribe, Subscriber, Unsubscribe } from '../src';

@Subscriber()
class SubscriberExample {
    @Subscribe('TEST_MESSAGE')
    foo(data: string, message: string): void {
        console.log(data);
    }

    @Unsubscribe()
    dispose(): void {
    }
}

var subscriber = new SubscriberExample();
PubSub.publish('TEST_MESSAGE', 'This message will be displayed');
subscriber.dispose();
PubSub.publish('TEST_MESSAGE', 'This message won\'t be displayed');