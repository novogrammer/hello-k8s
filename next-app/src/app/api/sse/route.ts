import { sendEventStream } from "../../../libs/event_stream_utils";
import { makeErrorResponse } from "../../../libs/api_utils";
import { NextResponse } from "next/server";

export async function GET(request:Request){
  
  const accept = request.headers.get("accept") || "";

  try{
    const text = '夜空に広がる無数の星々の中、ひときわ明るく輝く星がありました。';
    if(!accept.includes("text/event-stream")){

      return NextResponse.json({
        data: text
      },{
        status:200,
      });
    }

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


