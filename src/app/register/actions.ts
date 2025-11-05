'use server';

import { prisma } from '../../lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// Georgian to Latin transliteration mapping
const georgianToLatin: { [key: string]: string } = {
  'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v',
  'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm',
  'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's',
  'ტ': 't', 'უ': 'u', 'ფ': 'p', 'ქ': 'k', 'ღ': 'gh', 'ყ': 'q',
  'შ': 'sh', 'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch',
  'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
};

function transliterateGeorgian(text: string): string {
  return text.split('').map(char => georgianToLatin[char] || char).join('');
}

export async function registerStudent(formData: FormData) {
  const name = formData.get('name') as string;
  const surname = formData.get('surname') as string;
  const birthDateString = formData.get('birthDate') as string;
  const gender = formData.get('gender') as 'MALE' | 'FEMALE';
  const facultyId = parseInt(formData.get('facultyId') as string);
  const photo = formData.get('photo') as File;

  if (!name || !surname || !birthDateString || !gender || !facultyId || !photo) {
    throw new Error('All fields are required');
  }

  // Parse birth date more carefully
  let birthDate: Date;
  try {
    const dateStr = birthDateString.trim();
    // Create date from YYYY-MM-DD format
    const [year, month, day] = dateStr.split('-').map(Number);
    birthDate = new Date(year, month - 1, day); // month is 0-indexed
  } catch (error) {
    throw new Error('Invalid birth date format');
  }

  if (isNaN(birthDate.getTime())) {
    throw new Error('Invalid birth date');
  }

  // Generate email with transliterated names
  const latinName = transliterateGeorgian(name.toLowerCase());
  const latinSurname = transliterateGeorgian(surname.toLowerCase());
  const email = `${latinName}.${latinSurname}@kamauni.ge`;
  const password = 'kamauni2025';

  // Check if email already exists
  const existing = await prisma.student.findUnique({ where: { email } });
  if (existing) {
    throw new Error('Student with this name and surname already exists');
  }

  // Save photo
  const bytes = await photo.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${photo.name}`;
  const path = join(process.cwd(), 'public', 'uploads', filename);
  await writeFile(path, buffer);

  // Create student
  await prisma.student.create({
    data: {
      name,
      surname,
      birthDate,
      gender,
      photo: `/uploads/${filename}`,
      facultyId,
      email,
      password, // In real app, hash this
    },
  });

  return { email, password };
}