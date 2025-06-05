import { Queue, QueueEvents, Worker } from 'bullmq';
import {Redis} from 'ioredis';

const connection = new Redis(6379,'redis',{maxRetriesPerRequest:null});

export const jobQueue = new Queue('job_queue', { connection });
export const queueEvents = new QueueEvents('job_queue', { connection });

new Worker(
  'job_queue',
  async (job) => {
    // 長時間処理の例
    for (let i = 0; i <= 100; i += 20) {
      await job.updateProgress(i);
      await new Promise(res => setTimeout(res, 500));
    }
    return { result: `job ${job.id} done` };
  },
  { connection },
);
