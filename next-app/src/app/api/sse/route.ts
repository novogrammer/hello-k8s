import { sendEventStream } from "../../../libs/event_stream_utils";
import { makeErrorResponse } from "../../../libs/api_utils";

export async function GET(/* request:Request */){
  try{
    const text = '夜空に広がる無数の星々の中、ひときわ明るく輝く星がありました。'

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


