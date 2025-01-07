import { processNotificationQueue } from "./rabbitmq/queues/notificationQueue";


let initialized = false;

export async function initializeServices() {
  if (initialized) return;
  console.log("Init")
  try {
    await processNotificationQueue();
    initialized = true;
    console.log('RabbitMQ Consumer started successfully');
  } catch (error) {
    console.error('Failed to start RabbitMQ consumer:', error);
    // Optionally re-throw the error if you want to fail the app startup
    throw error;
  }
} 