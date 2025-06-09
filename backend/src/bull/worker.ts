import { Worker } from 'bullmq';
import { connection } from './redis-connection';


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
