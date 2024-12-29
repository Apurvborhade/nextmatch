import { processNotificationQueue } from './notificationQueue';

export async function initializeQueues() {
  console.log("INITIALIZING QUE")
  await processNotificationQueue();
}
