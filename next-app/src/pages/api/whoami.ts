import type { NextApiRequest, NextApiResponse } from 'next'

interface ResponseData {
  hostname: string;
  localAddress: string;
}

export default function handler(req:NextApiRequest, res:NextApiResponse<ResponseData>) {
  res.status(200).json({
    hostname: process.env.HOSTNAME || "unknown",
    localAddress: req.socket.localAddress || "unknown",
  })
}