import { sendEventStream } from "../../../../libs/event_stream_utils";
import { makeErrorResponse } from "../../../../libs/api_utils";


export async function GET(request:Request,{params}: { params: Promise<{ id: string }>}){
  try{
    const {id}=await params;
    
    const text = `${id} 夜空に広がる無数の星々の中、ひときわ明るく輝く星がありました。`

    let index = 0;
    return sendEventStream(async ()=>{
      if (index < text.length) {
        // awaitすることもありそう。
        const data=text[index];
        index++;
        return {
          data,
          isDone:false,
        }
      } else {
        return {
          isDone:true,
        };
      }

    });

  }catch(error:unknown){
    return makeErrorResponse(error);
  }  
}


