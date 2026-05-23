import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "商品情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}
