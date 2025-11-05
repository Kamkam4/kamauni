import 'dotenv/config';
import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('CWD:', process.cwd());
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    const faculties = await prisma.faculty.findMany();
    console.log('Faculties:', faculties);
    return NextResponse.json(faculties);
  } catch (error) {
    console.error('Error fetching faculties:', error);
    return NextResponse.json({ error: 'Failed to fetch faculties' }, { status: 500 });
  }
}