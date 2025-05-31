import { NextResponse } from 'next/server';



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
    const responseData:ResponseData={
      ok:true,
      id:"1",
    };
    return NextResponse.json(responseData);

  }catch(error){
    return NextResponse.json({
      ok: false,
      message: "Error whoami"
    },{
      status:500,
    });
  }
}
