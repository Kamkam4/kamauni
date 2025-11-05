'use server';

import { prisma } from '../../lib/prisma';
import { cookies } from 'next/headers';

export async function loginStudent(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const student = await prisma.student.findUnique({
    where: { email },
    include: { faculty: true },
  });

  if (!student || student.password !== password) {
    return { success: false };
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set('studentId', student.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return { success: true, student };
}