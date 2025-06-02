interface EventStreamCallbackResult{
  event?:string;
  data?:string;
  isDone:boolean;
}

type EventStreamCallback=()=>Promise<EventStreamCallbackResult>;


export function sendEventStream(callback:EventStreamCallback):Response{
  const {readable,writable}=new TransformStream();
  const writer = writable.getWriter();
  const textEncoder = new TextEncoder();

  const intervalId = setInterval(async () => {
    let result;
    try{
      result=await callback();

      if(result.event){
        writer.write(
          textEncoder.encode(`event: ${result.event}\n\n`)
        );
      }
      if(result.data){
        writer.write(
          textEncoder.encode(`data: ${result.data}\n\n`)
        );
      }
      if(result.isDone){
        writer.write(
          textEncoder.encode(
            `data: [DONE]\n\n`
          )
        )
        clearInterval(intervalId);
        // クライアントからの切断を期待する。サーバーから切断するとエラーになる。
        setTimeout(()=>{
          if(!writer.closed){
            writer.close();
          }
        },1000);
      }
    }catch(error:unknown){
      console.error(error);
      clearInterval(intervalId);
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
}