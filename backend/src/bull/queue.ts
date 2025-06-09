import { Queue, QueueEvents } from 'bullmq';
import { connection } from './redis-connection';
import {v4 as uuidv4} from "uuid";

export const jobQueue = new Queue('job_queue', { connection });
export const queueEvents = new QueueEvents('job_queue', { connection });

export function makeJobId():string{
  const jobId = uuidv4();
  return jobId;
}