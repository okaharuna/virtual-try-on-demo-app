import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

interface ClothesCategory {
  label: string;
  images: string[];
}

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "public", "clothes");

    // ディレクトリが存在するか確認
    if (!fs.existsSync(publicDir)) {
      return NextResponse.json({
        tops: { label: "トップス", images: [] },
        bottom: { label: "ボトム", images: [] },
        set: { label: "セットアップ", images: [] },
      });
    }

    const categories = ["tops", "bottom", "set"];
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

    const result: Record<string, ClothesCategory> = {};

    for (const category of categories) {
      const categoryDir = path.join(publicDir, category);
      let images: string[] = [];

      if (fs.existsSync(categoryDir)) {
        const files = fs.readdirSync(categoryDir);
        images = files
          .filter((file) => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext) && !file.startsWith(".");
          })
          .map((file) => `/clothes/${category}/${file}`);
      }

      result[category] = {
        label: category === "tops" ? "トップス" : category === "bottom" ? "ボトム" : "セットアップ",
        images,
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error reading clothes images:", error);
    return NextResponse.json(
      {
        tops: { label: "トップス", images: [] },
        bottom: { label: "ボトム", images: [] },
        set: { label: "セットアップ", images: [] },
      },
      { status: 500 }
    );
  }
}
