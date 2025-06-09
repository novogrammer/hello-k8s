import { Worker } from 'bullmq';
import { connection } from './redis-connection';
import { clientPromise, MINIO_BUCKET_NAME } from "../minio/client";

new Worker(
  'job_queue',
  async (job) => {
    // 長時間処理の例
    for (let i = 0; i <= 100; i += 20) {
      await job.updateProgress(i);
      await new Promise(res => setTimeout(res, 500));
    }
    const client = await clientPromise;

    const jobId = job.id!;

    const inputStream = await client.getObject(MINIO_BUCKET_NAME,`${jobId}/input.txt`);

    const buffers = [];

    // node.js readable streams implement the async iterator protocol
    for await (const data of inputStream) {
      buffers.push(data);
    }

    const message = Buffer.concat(buffers).toString("utf8");

    await client.putObject(MINIO_BUCKET_NAME,`${jobId}/output.txt`,"hello " + message);


    return { result: `job ${job.id} done` };
  },
  { connection },
);
