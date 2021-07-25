# type-pubsub

`type-pubsub` is TypeScript library implementing the Publish/Subscribe pattern for Node.js or web browser.

## Installation

To start using type-pubsub install the npm package:

```bash
npm install type-pubsub
```

Also you need to configure your TypeScript to enable experimental decorators. Add these line to your `tsconfig.json` file under the `compilerOptions` key:

```json
"experimentalDecorators": true,
```

## Basic Usage

```ts
import { PubSub, Subscribe, Subscriber, Unsubscribe } from 'type-pubsub';

@Subscriber()
class SubscriberExample {
  @Subscribe('TEST_MESSAGE')
  foo(data: string, message: string): void {
    console.log(`Message received: ${message}, Data: ${data}`);
  }

  @Unsubscribe() // Calling the method marked with @Unsibscribe() will unregister all the subscriptions
  dispose(): void {}
}

var subscriber = new SubscriberExample();
PubSub.publish('TEST_MESSAGE', 'This message will be displayed');
subscriber.dispose(); // Unsubscribe
PubSub.publish('TEST_MESSAGE', "This message won't be displayed");
```

You can also create channels to publish messages manually and specify which one you want to observe:

```ts
const channel = new Channel<string>();

@Subscriber(channel)
class SubscriberExample {
  @Subscribe('TEST_MESSAGE')
  foo(data: string, message: string): void {
    console.log(`Message received: ${message}, Data: ${data}`);
  }
}

const data = {
  // Some data here
};
channel.publish('TEST_MESSAGE', data);
```

If needed, you can mark a method with multiple @Subscribe() decorators to observe different messages:

```ts
@Subscriber()
class SubscriberExample {
  @Subscribe('TEST_MESSAGE')
  @Subscribe('OTHER_MESSAGE')
  foo(data: string, message: string): void {
    console.log(`Message received: ${message}, Data: ${data}`);
  }
}
```

## License

MIT - http://rem.mit-license.org
