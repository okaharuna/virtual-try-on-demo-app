import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "public", "sample-person");

    // ディレクトリが存在するか確認
    if (!fs.existsSync(publicDir)) {
      return NextResponse.json({ images: [] });
    }

    // ディレクトリ内のファイルを取得
    const files = fs.readdirSync(publicDir);

    // 画像ファイルのみフィルタリング
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const imageFiles = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext) && !file.startsWith(".");
      })
      .map((file) => `/sample-person/${file}`);

    return NextResponse.json({ images: imageFiles });
  } catch (error) {
    console.error("Error reading person images:", error);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}
