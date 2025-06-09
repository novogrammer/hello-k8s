import { Queue, QueueEvents } from 'bullmq';
import { connection } from './redis-connection';

export const jobQueue = new Queue('job_queue', { connection });
export const queueEvents = new QueueEvents('job_queue', { connection });

