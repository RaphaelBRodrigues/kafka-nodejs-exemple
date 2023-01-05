import express, { Application } from 'express';
import dotenv from 'dotenv';
import KafkaClient from './utils/KafkaClient';
import routes from './routes';

dotenv.config();

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
    console.log(process.env.KAFKA_TOPIC, process.env.KAFKA_CLIENT, process.env.KAFKA_BROKERS)
    await this.kafkaClient.configure({
      topic: process.env.KAFKA_TOPIC!,
      clientId: process.env.KAFKA_CLIENT!,
      brokers: [process.env.KAFKA_BROKERS!]
    });
    console.log("teste")
    this
      .express
      .use((req, res, next) => {
        req.kafka = this.kafkaClient;

        next()
      });
  }

  private setupRoutes() {
    this.express.use(routes);
  }

  private setupMiddlewares() {
    this.express.use(express.json());
  }

  private listen() {
    this.express.listen(3000, () => {
      console.log('App Running');
    });
  }
}

export default App;
