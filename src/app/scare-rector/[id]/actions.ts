'use server';

import { prisma } from '../../../lib/prisma';

export async function updateAllGradesToHighest(studentId: string) {
  try {
    const studentIdInt = parseInt(studentId);
    if (isNaN(studentIdInt)) {
      return { success: false, error: 'Invalid student ID' };
    }

    // Get the student with their faculty
    const student = await prisma.student.findUnique({
      where: { id: studentIdInt },
      include: { faculty: true },
    });

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    // Get only subjects that belong to the student's faculty
    const subjects = await prisma.subject.findMany({
      where: { facultyId: student.facultyId },
    });

    // Update all grades for this student to the highest grade (A with score 100) for faculty subjects only
    const updatePromises = subjects.map((subject: { id: number; name: string; credits: number; facultyId: number }) =>
      prisma.grade.upsert({
        where: {
          studentId_subjectId: {
            studentId: studentIdInt,
            subjectId: subject.id,
          },
        },
        update: {
          grade: 'A', // Highest letter grade
          score: 100, // Highest numerical score
        },
        create: {
          studentId: studentIdInt,
          subjectId: subject.id,
          grade: 'A',
          score: 100,
        },
      })
    );

    await Promise.all(updatePromises);

    return { success: true };
  } catch (error) {
    console.error('Error updating grades:', error);
    return { success: false, error: 'Failed to update grades' };
  }
}