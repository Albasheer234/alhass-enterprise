import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const accounts = await prisma.paymentAccount.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
    select: {
      id: true,
      provider: true,
      accountName: true,
      accountNumber: true,
      isActive: true,
      displayOrder: true,
    },
  });
  return NextResponse.json(accounts);
}
