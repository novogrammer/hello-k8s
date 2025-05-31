import { NextResponse } from 'next/server';

interface ResponseData {
  hostname: string;
}

export async function GET(request:Request){
  try{
    const responseData:ResponseData={
      hostname: process.env.HOSTNAME || "unknown",
    };
    return NextResponse.json(responseData);

  }catch(error){
    return NextResponse.json({
      message: "Error whoami"
    },{
      status:500,
    });
  }
}
