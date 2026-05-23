import { NextResponse } from "next/server";
import { getProductById } from "@/lib/products";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductById(params.id);

    if (!product) {
      return NextResponse.json(
        { error: "商品が見つかりませんでした" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "商品情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}
