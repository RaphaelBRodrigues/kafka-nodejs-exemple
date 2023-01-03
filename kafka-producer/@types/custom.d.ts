import KafkaClient from "../src/utils/KafkaClient"

declare global {
  namespace Express {
    interface Request {
      kafka: KafkaClient
    }
  }
}
