import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Organic Natto Triple Pack",
    nameJa: "有機納豆3パックセット",
    description:
      "国産有機大豆100%使用の本格納豆。自然発酵により旨みと栄養が凝縮されています。竹製パッケージ使用。",
    price: 480,
    stock: 10,
    category: "fermented-foods",
    imageUrl:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
  },
  {
    name: "Seasonal Fruit Box",
    nameJa: "旬のフルーツBOX",
    description:
      "厳選された旬のフルーツを産地直送でお届け。持続可能な農業で育てられた最高品質の果物セット。",
    price: 2980,
    stock: 10,
    category: "fruits",
    imageUrl:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&q=80",
  },
  {
    name: "Organic Fair-Trade Banana",
    nameJa: "有機バナナ (フェアトレード)",
    description:
      "フェアトレード認証の有機バナナ。農家の方々の適正な対価を守り、環境にも配慮した栽培方法で育てられています。",
    price: 650,
    stock: 10,
    category: "fruits",
    imageUrl:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80",
  },
  {
    name: "Premium Shinshu Apple",
    nameJa: "信州産りんご (特選)",
    description:
      "長野県信州の豊かな自然で育まれた特選りんご。蜜がたっぷり入った甘みと爽やかな酸味が絶妙なバランスです。",
    price: 1380,
    stock: 10,
    category: "fruits",
    imageUrl:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&q=80",
  },
  {
    name: "Premium Wakayama Mandarin",
    nameJa: "和歌山みかん (プレミアム)",
    description:
      "日本一のみかん産地、和歌山県産のプレミアムみかん。温暖な気候と豊富な日照時間が育む甘くジューシーな逸品。",
    price: 1680,
    stock: 10,
    category: "fruits",
    imageUrl:
      "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=800&q=80",
  },
  {
    name: "Bamboo Toilet Paper 12 Rolls",
    nameJa: "竹繊維トイレットペーパー12R",
    description:
      "持続可能な竹繊維100%使用のエコトイレットペーパー。石油系包装材不使用。森林保護と地球環境への配慮から生まれました。",
    price: 1980,
    stock: 10,
    category: "household",
    imageUrl:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80",
  },
  {
    name: "Seasonal Organic Vegetable Set",
    nameJa: "旬の有機野菜セット",
    description:
      "全国の有機農家から直送される旬の野菜セット。農薬不使用・化学肥料不使用で育てた安心安全な野菜が勢揃い。",
    price: 3480,
    stock: 10,
    category: "vegetables",
    imageUrl:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
  },
  {
    name: "Domestic Organic White Rice 5kg",
    nameJa: "国産有機白米 5kg",
    description:
      "JAS認証取得の国産有機白米5kg。農薬・化学肥料を一切使わない自然栽培で育てられた最高級のお米です。",
    price: 2480,
    stock: 10,
    category: "grains",
    imageUrl:
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&q=80",
  },
  {
    name: "Domestic Natural Honey",
    nameJa: "国産天然はちみつ",
    description:
      "国内の豊かな自然で採取した純粋天然はちみつ。非加熱・無添加で酵素や栄養素をそのまま保持。ガラス瓶入り。",
    price: 1780,
    stock: 10,
    category: "condiments",
    imageUrl:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
  },
  {
    name: "Organic Sencha Green Tea (Shizuoka)",
    nameJa: "有機煎茶 (静岡産)",
    description:
      "日本一のお茶産地、静岡県産の有機煎茶。農薬不使用の茶葉を丁寧に手摘みし、伝統製法で仕上げた最高級の一品。",
    price: 1080,
    stock: 10,
    category: "beverages",
    imageUrl:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",
  },
];

async function main() {
  console.log("Seeding database...");

  for (const product of products) {
    await prisma.product.upsert({
      where: { nameJa: product.nameJa },
      update: product,
      create: product,
    });
  }

  console.log(`Seeded ${products.length} products successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
