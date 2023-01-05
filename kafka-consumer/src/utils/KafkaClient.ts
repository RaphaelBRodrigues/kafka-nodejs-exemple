import { Consumer, Kafka, KafkaMessage } from 'kafkajs';

type KafkaConfig = {
  clientId: string;
  brokers: string[];
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
    clientId
  }: Omit<KafkaConfig, 'topic' | 'groupdId'>) {
    return new Kafka({
      clientId,
      brokers
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
