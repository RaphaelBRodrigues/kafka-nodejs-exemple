import { Kafka, Message, Producer } from 'kafkajs';

type KafkaConfig = {
  clientId: string;
  brokers: string[];
  username: string;
  password: string;
  topic: string;
};

type Object = Record<any, any>;

class KafkaClient {
  private producer: Producer;
  private topic: string;

  public async configure(config: KafkaConfig) {
    this.topic = config.topic;

    const kafka = this.createKafkaInstance(config);
    await this.createAndConnectToProducer(kafka);
  }

  private createKafkaInstance({
    brokers,
    clientId,
    password,
    username,
  }: Omit<KafkaConfig, 'topic'>) {
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

  private async createAndConnectToProducer(kafka: Kafka) {
    this.producer = kafka.producer();
    await this.producer.connect();
  }

  async sendToQueue(rawMessages: Object[]) {
    const parsedMessages = this.parseMessages(rawMessages);

    const result = await this.producer.send({
      topic: this.topic,
      messages: parsedMessages,
    });

    return result;
  }

  private parseMessages(messages: Object[]): Message[] {
    const parsedMessages = messages.map((message) => {
      return {
        value: JSON.stringify(message),
      };
    });

    return parsedMessages;
  }
}

export default KafkaClient;
