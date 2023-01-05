import { AdminConfig, Kafka, Message, Producer } from 'kafkajs';

type KafkaConfig = {
  clientId: string;
  brokers: string[];
  topic: string;
};

type Object = Record<any, any>;

class KafkaClient {
  private producer: Producer;
  private topic: string;
  private kafka: Kafka;

  public async configure(config: KafkaConfig) {
    this.topic = config.topic;

    this.kafka = this.createKafkaInstance(config);
    await this.assertTopic();
    await this.createAndConnectToProducer();
  }


  private createKafkaInstance({
    brokers,
    clientId
  }: Omit<KafkaConfig, 'topic'>) {
    return new Kafka({
      clientId,
      brokers
    });
  }

  async assertTopic() {
    const admin = this.kafka.admin();
    await admin.createTopics({
      topics: [{
        topic: this.topic
      }]
    });
  }

  private async createAndConnectToProducer() {
    this.producer = this.kafka.producer();
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

  private disconnect() {
    this.producer.disconnect();
  }
}

export default KafkaClient;
