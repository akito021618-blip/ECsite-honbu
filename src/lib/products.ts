import { prisma } from "@/lib/prisma";
import type { Product } from "@/types";

export async function getAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
  });
  return products as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  return product as Product | null;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { category },
    orderBy: { createdAt: "asc" },
  });
  return products as Product[];
}
