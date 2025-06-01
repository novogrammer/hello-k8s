import { NextResponse } from 'next/server';

interface RequestData{
  message:string;
}

interface ResponseDataOk{
  ok:true;
  id:string;
}
interface ResponseDataNg{
  ok:false;
  message:string;
}
type ResponseData = 
  | ResponseDataOk
  | ResponseDataNg;

export async function POST(request:Request){
  try{
    const requestData = await request.json() as RequestData;
    const responseData:ResponseData={
      ok:true,
      id:requestData.message,
    };
    return NextResponse.json(responseData);

  }catch/* (error) */{
    return NextResponse.json({
      ok: false,
      message: "Error whoami"
    },{
      status:500,
    });
  }
}
