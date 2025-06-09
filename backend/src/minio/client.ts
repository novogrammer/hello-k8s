import { Client } from 'minio';

// 使う前にsetupClientが必要
const client = new Client({
  endPoint: 'minio',
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER!,
  secretKey: process.env.MINIO_ROOT_PASSWORD!,
});

export const MINIO_BUCKET_NAME = "mybucket";


async function ensureBucketAsync(bucket: string) {
  const exists = await client.bucketExists(bucket);
  if (!exists) {
    await client.makeBucket(bucket, 'us-east-1');
  }
}


async function setupClient():Promise<Client>{
  await ensureBucketAsync(MINIO_BUCKET_NAME);
  return client;
}

export const clientPromise = setupClient();
