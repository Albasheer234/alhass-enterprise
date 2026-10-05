import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const search = (req.nextUrl.searchParams.get('search') ?? '').trim();
  const categoryId = req.nextUrl.searchParams.get('category') ?? '';

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      ...(categoryId ? { categoryId } : {}),
      ...(search
        ? { name: { contains: search } }
        : {}),
    },
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return NextResponse.json(products);
}
