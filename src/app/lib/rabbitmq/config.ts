const RABBITMQ_CONFIG = {
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
    queues: {
        notificationQueue: "notifications",
    }
}

export default RABBITMQ_CONFIG;