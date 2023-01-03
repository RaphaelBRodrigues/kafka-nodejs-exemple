import express, { Application } from 'express';
import KafkaClient from './utils/KafkaClient';
import routes from './routes';

class App {
  private express: Application;

  constructor(private kafkaClient: KafkaClient) {
    this.express = express();
  }

  async start() {
    await this.startKafkaConnection();
    this.setupMiddlewares();
    this.setupRoutes();
    this.listen();
  }

  private async startKafkaConnection() {
    await this.kafkaClient.configure({
      topic: process.env.KAFKA_TOPIC!,
      clientId: process.env.KAFKA_CLIENT!,
      brokers: [process.env.KAFKA_BROKERS!],
      password: process.env.KAFKA_USERNAME!,
      username: process.env.KAFKA_PASSWORD!,
    });
  }

  private setupRoutes() {
    this.express.use(routes);
  }

  private setupMiddlewares() {
    this.express.use(express.json());
  }

  listen() {
    this.express.listen(3000, () => {
      console.log('App Running');
    });
  }
}

export default App;
