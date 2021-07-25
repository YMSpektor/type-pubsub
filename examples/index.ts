import 'reflect-metadata';

import { Channel, Subscribe, Subscriber, Unsubscribe } from '../src';

const channel = new Channel<string>();

@Subscriber(channel)
class Test {
    constructor(private name: string) {}

    @Subscribe('TEST')
    test(data: string, message: string): void {
        console.log(this.name + ': ' + data);
    }

    @Unsubscribe()
    dispose(): void {
    }
}

var test1 = new Test('test1');
var test2 = new Test('test2');
channel.publish('TEST', 'Will be displayed');
test1.dispose();
test2.dispose();
channel.publish('TEST', 'Won\'t be displayed');