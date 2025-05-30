import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
}