import dotenv from 'dotenv';
import KafkaClient from './utils/KafkaClient';

dotenv.config();

class Application {
  private kafkaClient: KafkaClient;

  constructor() {
    this.kafkaClient = new KafkaClient();

    this.kafkaClient.configure({
      topic: process.env.KAFKA_TOPIC!,
      clientId: process.env.KAFKA_CLIENT!,
      brokers: [process.env.KAFKA_BROKERS!],
      groupId: process.env.KAFKA_CONSUMER_ID!
    });
  }

  startConsumer() {
    this.kafkaClient.consume((message) => {
      console.log(message);
    });
  }
}

new Application().startConsumer();
