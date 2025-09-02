import { NextResponse } from 'next/server';

export async function GET() {
  console.log("🧪 [UploadThing Test] Test endpoint called");
  console.log("🧪 [UploadThing Test] Environment variables:", {
    hasUploadThingToken: !!process.env.UPLOADTHING_TOKEN,
    tokenLength: process.env.UPLOADTHING_TOKEN?.length || 0,
    nodeEnv: process.env.NODE_ENV
  });
  
  return NextResponse.json({
    message: "UploadThing test endpoint working",
    hasToken: !!process.env.UPLOADTHING_TOKEN,
    tokenLength: process.env.UPLOADTHING_TOKEN?.length || 0,
    timestamp: new Date().toISOString()
  });
}
