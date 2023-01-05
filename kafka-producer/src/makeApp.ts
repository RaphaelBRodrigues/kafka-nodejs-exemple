import App from './app';
import KafkaClient from './utils/KafkaClient';

function makeApp() {
  const kafkaClient = new KafkaClient();

  const app = new App(kafkaClient);

  return {
    app,
    kafkaClient,
  };
}

export default makeApp;
