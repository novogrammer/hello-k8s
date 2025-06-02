import { NextResponse } from 'next/server';

export function makeErrorResponse(error:unknown){
  if(error instanceof Error){
    return NextResponse.json({
      message: error.message
    },{
      status:500,
    });
  }else{
    return NextResponse.json({
      message: "unknown error"
    },{
      status:500,
    });

  }

}