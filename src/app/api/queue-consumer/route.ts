import { NextResponse } from 'next/server';
import { initializeServices } from '@/app/lib/init';

export async function GET() {
  try {
    await initializeServices();
    return NextResponse.json({ status: 'Consumer initialization checked' });
  } catch (error) {
    console.error('Failed to initialize consumer:', error);
    return NextResponse.json(
      { error: 'Failed to initialize consumer' },
      { status: 500 }
    );
  }
} 