import express, { Request, Response } from 'express';
import { jobQueue, queueEvents } from './bull';
import { JobProgress } from 'bullmq';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

const app = express();
app.use(express.json());

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullMQAdapter(jobQueue)],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());


app.get('/api/health', (_req: Request, res: Response) => {
  res.sendStatus(200);
  return;
});

app.get('/api/whoami',(req: Request, res: Response)=>{
  res.status(200).json({
    hostname: process.env.HOSTNAME || "unknown",
    localAddress: req.socket.localAddress || "unknown",
  });
});

app.get('/api/sse',(req: Request, res: Response)=>{
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // gzip圧縮させない
  res.setHeader('Content-Encoding', 'none');

  const text = '夜空に広がる無数の星々の中、ひときわ明るく輝く星がありました。'

  let index = 0;
  const intervalId = setInterval(() => {
    if (index < text.length) {
      res.write(`data: ${text[index]}\n\n`);
      index++;
    } else {
      res.write(`data: [DONE]\n\n`); // ChatGPTっぽく終端文字を挿入
      clearInterval(intervalId);
      // クライアントからの切断を期待する。サーバーから切断するとエラーになる。
      setTimeout(()=>{
        res.end();
      },1000);
    }
  }, 100);

  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });

});

app.post('/api/messages',(req: Request, res: Response)=>{
  const { message } = req.body;
  res.status(202).json({
    ok:true,
    id:message,
  });
});

app.get('/api/messages/:id',(req: Request, res: Response)=>{

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // gzip圧縮させない
  res.setHeader('Content-Encoding', 'none');

  const id = req.params.id;
  const text = `${id} 夜空に広がる無数の星々の中、ひときわ明るく輝く星がありました。`

  let index = 0;
  const intervalId = setInterval(() => {
    if (index < text.length) {
      res.write(`data: ${text[index]}\n\n`);
      index++;
    } else {
      res.write(`data: [DONE]\n\n`); // ChatGPTっぽく終端文字を挿入
      clearInterval(intervalId);
      // クライアントからの切断を期待する。サーバーから切断するとエラーになる。
      setTimeout(()=>{
        res.end();
      },1000);
    }
  }, 100);

  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });

});


// ── ジョブ登録エンドポイント ──
// POST /api/jobs で body に message を渡すと即 id を返す
app.post('/api/jobs', async (req: Request, res: Response) => {
  const { message } = req.body;
  const job = await jobQueue.add('longTask', message, {
    removeOnComplete: {
      count:1000,
    },
  });
  if(!job){
    res.status(500).json({ message: 'jobQueue.add() failed' });
    return;
  }
  if(!job.id){
    res.status(500).json({ message: 'job.is is null' });
    return;
  }
  res.status(202).json({
    ok:true,
    id: job.id });
  return;
});

// ── ジョブ状態取得エンドポイント ──
// GET /api/jobs/:id で現状を返す
app.get('/api/jobs/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const job = await jobQueue.getJob(id);
  if (!job) {
    res.status(404).json({ message: `job id=${id} not found` });
    return;
  }

  const state = await job.getState();
  const progress = job.progress;
  let result = null;
  let failedReason = null;
  if (state === 'completed') result = await job.returnvalue;
  if (state === 'failed') failedReason = job.failedReason;

  res.json({ jobId: id, state, progress, result, failedReason });
  return;
});

// ── SSE エンドポイント ──
// GET /api/jobs/:id/sse で進捗や完了通知をリアルタイムに流す
app.get('/api/jobs/:id/sse', async (req: Request, res: Response) => {
  const id = req.params.id;

  // SSE ヘッダ
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // gzip圧縮させない
  res.setHeader('Content-Encoding', 'none');

  let ended = false;
  const finishConnection = () => {
    if (ended) return;
    ended = true;
    queueEvents.removeListener('progress', onProgress);
    queueEvents.removeListener('completed', onCompleted);
    queueEvents.removeListener('failed', onFailed);

    sendDone();
    setTimeout(()=>{
      res.end();
    },1000);
  };
  res.once('close', finishConnection);

  const sendDone = () => {
    res.write(`data: [DONE]\n\n`); // ChatGPTっぽく終端文字を挿入
  };
  const sendEvent = (eventName: string, dataObj: any) => {
    const payload = JSON.stringify(dataObj);
    if(eventName){
      res.write(`event: ${eventName}\n`);

    }
    res.write(`data: ${payload}\n\n`);
  };

  const onProgress = (args: { jobId: string; data: JobProgress }) => {
    if(ended) return;
    if (args.jobId !== id) return;
    sendEvent('progress', { status: 'progress', progress: args.data });
  };
  const onCompleted = (args: { jobId: string; returnvalue: any }) => {
    if(ended) return;
    if (args.jobId !== id) return;
    sendEvent('completed', { status: 'completed', result: args.returnvalue });
    finishConnection();
  };
  const onFailed = (args: { jobId: string; failedReason: string }) => {
    if(ended) return;
    if (args.jobId !== id) return;
    sendEvent('failed', { status: 'failed', reason: args.failedReason });
    finishConnection();
  };

  queueEvents.on('progress', onProgress);
  queueEvents.on('completed', onCompleted);
  queueEvents.on('failed', onFailed);

  // 接続時点の状態も一度返す
  const job = await jobQueue.getJob(id);
  if (!job) {
    finishConnection();
    return;
  }
  const state = await job.getState();
  if (state === 'completed') {
    const result = await job.returnvalue;
    sendEvent('completed', { status: 'completed', result });
    finishConnection();
    return;
  }
  if (state === 'failed') {
    const reason = job.failedReason;
    sendEvent('failed', { status: 'failed', reason });
    finishConnection();
    return;
  }
  // waiting/active の場合は、onProgress/onCompleted/onFailed を待つ
});

app.listen(4000, () => {
  console.log('Express server listening on http://localhost:4000');
});
