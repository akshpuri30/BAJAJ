import { NextResponse } from 'next/server';
import { handleInput } from '@/lib/processor';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !Array.isArray(body.inputArr)) {
      return NextResponse.json({ error: "Invalid request body. 'inputArr' array is required." }, { status: 400 });
    }
    
    const result = handleInput(body.inputArr);
    
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
