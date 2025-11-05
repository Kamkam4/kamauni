import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Check for a simple auth token (you can make this more secure)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.SEED_TOKEN || 'kamauni2025'}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Faculties
    const faculties = [
      { name: 'ბიზნესის ადმინისტრირების ფაკულტეტი' },
      { name: 'კომპიუტერული მეცნიერების ფაკულტეტი' },
      { name: 'სამართლის ფაკულტეტი' },
      { name: 'მედიცინის ფაკულტეტი' },
      { name: 'ჰუმანიტარული მეცნიერებების ფაკულტეტი' },
      { name: 'ფიზიკა-მათემატიკის ფაკულტეტი' },
      { name: 'ბიოლოგიის ფაკულტეტი' },
      { name: 'სოციალურ მეცნიერებათა ფაკულტეტი' },
    ];

    for (const faculty of faculties) {
      await prisma.faculty.upsert({
        where: { name: faculty.name },
        update: {},
        create: faculty,
      });
    }

    // Subjects
    const subjectsData = [
      {
        facultyName: 'ბიზნესის ადმინისტრირების ფაკულტეტი',
        subjects: [
          { name: 'მაკროეკონომიკა', credits: 6 },
          { name: 'მიკროეკონომიკა', credits: 6 },
          { name: 'მენეჯმენტი', credits: 6 },
          { name: 'მარკეტინგი', credits: 6 },
          { name: 'ფინანსები', credits: 6 },
          { name: 'ბუღალტერია', credits: 6 },
        ],
      },
      {
        facultyName: 'კომპიუტერული მეცნიერების ფაკულტეტი',
        subjects: [
          { name: 'პროგრამირება', credits: 6 },
          { name: 'მონაცემთა სტრუქტურები', credits: 6 },
          { name: 'ალგორითმები', credits: 6 },
          { name: 'მონაცემთა ბაზები', credits: 6 },
          { name: 'ვებ ტექნოლოგიები', credits: 6 },
          { name: 'კიბერუსაფრთხოება', credits: 6 },
        ],
      },
      {
        facultyName: 'სამართლის ფაკულტეტი',
        subjects: [
          { name: 'კონსტიტუციური სამართალი', credits: 6 },
          { name: 'სისხლის სამართალი', credits: 6 },
          { name: 'სამოქალაქო სამართალი', credits: 6 },
          { name: 'საერთაშორისო სამართალი', credits: 6 },
          { name: 'ადმინისტრაციული სამართალი', credits: 6 },
          { name: 'სამართლებრივი ეთიკა', credits: 6 },
        ],
      },
      {
        facultyName: 'მედიცინის ფაკულტეტი',
        subjects: [
          { name: 'ანატომია', credits: 6 },
          { name: 'ფიზიოლოგია', credits: 6 },
          { name: 'ბიოქიმია', credits: 6 },
          { name: 'ფარმაკოლოგია', credits: 6 },
          { name: 'პათოლოგია', credits: 6 },
          { name: 'კლინიკური მედიცინა', credits: 6 },
        ],
      },
      {
        facultyName: 'ჰუმანიტარული მეცნიერებების ფაკულტეტი',
        subjects: [
          { name: 'ლიტერატურა', credits: 6 },
          { name: 'ისტორია', credits: 6 },
          { name: 'ფილოსოფია', credits: 6 },
          { name: 'ენათმეცნიერება', credits: 6 },
          { name: 'კულტუროლოგია', credits: 6 },
          { name: 'ხელოვნება', credits: 6 },
        ],
      },
      {
        facultyName: 'ფიზიკა-მათემატიკის ფაკულტეტი',
        subjects: [
          { name: 'მათემატიკა', credits: 6 },
          { name: 'ფიზიკა', credits: 6 },
          { name: 'ალგებრა', credits: 6 },
          { name: 'გეომეტრია', credits: 6 },
          { name: 'სტატისტიკა', credits: 6 },
          { name: 'კალკულუსი', credits: 6 },
        ],
      },
      {
        facultyName: 'ბიოლოგიის ფაკულტეტი',
        subjects: [
          { name: 'ბიოლოგია', credits: 6 },
          { name: 'ეკოლოგია', credits: 6 },
          { name: 'გენეტიკა', credits: 6 },
          { name: 'მიკრობიოლოგია', credits: 6 },
          { name: 'ბოტანიკა', credits: 6 },
          { name: 'ზოოლოგია', credits: 6 },
        ],
      },
      {
        facultyName: 'სოციალურ მეცნიერებათა ფაკულტეტი',
        subjects: [
          { name: 'სოციოლოგია', credits: 6 },
          { name: 'ფსიქოლოგია', credits: 6 },
          { name: 'პოლიტოლოგია', credits: 6 },
          { name: 'ეკონომიკა', credits: 6 },
          { name: 'ანთროპოლოგია', credits: 6 },
          { name: 'სოციალური სამუშაო', credits: 6 },
        ],
      },
    ];

    for (const data of subjectsData) {
      const faculty = await prisma.faculty.findUnique({
        where: { name: data.facultyName },
      });
      if (faculty) {
        for (const subject of data.subjects) {
          await prisma.subject.upsert({
            where: { name_facultyId: { name: subject.name, facultyId: faculty.id } },
            update: {},
            create: {
              name: subject.name,
              credits: subject.credits,
              facultyId: faculty.id,
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with faculties and subjects'
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to seed database'
    }, { status: 500 });
  }
}