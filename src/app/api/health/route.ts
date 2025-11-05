import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    // Test database connection
    const facultyCount = await prisma.faculty.count();
    const studentCount = await prisma.student.count();

    return NextResponse.json({
      status: 'OK',
      database: 'Connected',
      faculties: facultyCount,
      students: studentCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}