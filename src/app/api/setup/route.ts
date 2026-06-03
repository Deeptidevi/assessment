import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/init-db';

export async function GET() {
  try {
    await initializeDatabase();
    return NextResponse.json({ message: 'Database initialized successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to initialize database', details: error.message }, { status: 500 });
  }
}
