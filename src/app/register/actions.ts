'use server';

import { prisma } from '../../lib/prisma';
import { put } from '@vercel/blob';

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
  try {
    console.log('Starting registration process...');

    const name = formData.get('name') as string;
    const surname = formData.get('surname') as string;
    const birthDateString = formData.get('birthDate') as string;
    const gender = formData.get('gender') as 'MALE' | 'FEMALE';
    const facultyId = parseInt(formData.get('facultyId') as string);
    const photo = formData.get('photo') as File;

    console.log('Form data received:', { name, surname, birthDateString, gender, facultyId, photo: photo ? 'present' : 'missing' });

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
      console.log('Parsed birth date:', birthDate);
    } catch (error) {
      console.error('Date parsing error:', error);
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

    console.log('Generated email:', email);

    // Check if email already exists
    console.log('Checking for existing student...');
    const existing = await prisma.student.findUnique({ where: { email } });
    if (existing) {
      throw new Error('Student with this name and surname already exists');
    }

    // Save photo to Vercel Blob
    console.log('Uploading photo to Vercel Blob...');
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${photo.name}`;
    const blob = await put(filename, buffer, {
      access: 'public',
    });
    const photoUrl = blob.url;
    console.log('Photo uploaded:', photoUrl);

    // Create student
    console.log('Creating student in database...');
    await prisma.student.create({
      data: {
        name,
        surname,
        birthDate,
        gender,
        photo: photoUrl,
        facultyId,
        email,
        password, // In real app, hash this
      },
    });

    console.log('Student created successfully');
    return { email, password };
  } catch (error) {
    console.error('Registration error:', error);
    // Re-throw with more specific error message
    if (error instanceof Error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
    throw new Error('Registration failed: Unknown error');
  }
}