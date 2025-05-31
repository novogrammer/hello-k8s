import { NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next'


export async function GET(request:Request){
  try{
    const {readable,writable}=new TransformStream();
    const writer = writable.getWriter();
    const textEncoder = new TextEncoder();

    const text = '夜空に広がる無数の星々の中、ひときわ明るく輝く星がありました。'

      let index = 0;
    const intervalId = setInterval(() => {
      if (index < text.length) {
        writer.write(
          textEncoder.encode(
            `data: ${text[index]}\n\n`
          )
        )
        index++;
      } else {
        // ChatGPTっぽく終端文字を挿入
        writer.write(
          textEncoder.encode(
            `data: [DONE]\n\n`
          )
        )
        clearInterval(intervalId);
        // クライアントからの切断を期待する。サーバーから切断するとエラーになる。
        setTimeout(()=>{
          writer.close();
        },1000);
      }
    }, 100);


    return new Response(readable,{
      headers:{
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        // gzip圧縮させない
        'Content-Encoding': 'none',
      }
    })

  }catch(error){
    return NextResponse.json({
      message: "Error whoami"
    },{
      status:500,
    });
  }  
}


