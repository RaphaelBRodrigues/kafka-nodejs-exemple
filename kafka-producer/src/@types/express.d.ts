import KafkaClient from "../utils/KafkaClient";

declare global {
  namespace Express {
    interface Request {
      kafka: KafkaClient
    }
  }
}

import 'express';

declare module 'express' {
  interface Request {
    user?: any;
  }
}
