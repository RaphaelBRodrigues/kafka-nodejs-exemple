import { Consumer, EachMessageHandler, EachMessagePayload, Kafka, KafkaMessage, Message } from 'kafkajs';

type KafkaConfig = {
  clientId: string;
  brokers: string[];
  username: string;
  password: string;
  topic: string;
  groupId: string;
};

type Callback = (message: string) => void;

class KafkaClient {
  private consumer: Consumer;
  private topic: string;

  public async configure(config: KafkaConfig) {
    this.topic = config.topic;

    const kafka = this.createKafkaInstance(config);
    await this.createAndConnectToConsumer(kafka, config.groupId);
  }

  private createKafkaInstance({
    brokers,
    clientId,
    password,
    username
  }: Omit<KafkaConfig, 'topic' | 'groupdId'>) {
    return new Kafka({
      clientId,
      brokers,
      sasl: {
        mechanism: 'scram-sha-512',
        username,
        password,
      },
      ssl: true,
    });
  }

  private async createAndConnectToConsumer(kafka: Kafka, groupId: string) {
    this.consumer = kafka.consumer({
      groupId
    })

    await this.consumer.connect()
  }

  async consume(callback: Callback) {
    await this.consumer.subscribe({
      topics: [this.topic],
      fromBeginning: true
    })

    await this.consumer.run({
      eachMessage: async ({
        message
      }) => {
        const parsedMessage = this.parseMessages(message);
        callback(parsedMessage);
      }
    })
  }

  private parseMessages(message: KafkaMessage): string {
    const parsedMessage = message.value?.toString() || "";

    return parsedMessage;
  }
}

export default KafkaClient;
