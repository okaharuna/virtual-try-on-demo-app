import { callVirtualTryOnAPI } from "@/lib/google-cloud";
import type { TryOnRequest } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: TryOnRequest = await request.json();

    console.log("=== API Route: Request received ===");
    console.log("Person image present:", !!body.personImage);
    console.log("Person image length:", body.personImage?.substring(0, 50));
    console.log("Product images count:", body.productImages?.length);
    console.log("Product image present:", !!body.productImages?.[0]);

    // Validate request
    if (!body.personImage || !body.productImages || body.productImages.length === 0) {
      console.error("Validation failed: Missing images");
      return NextResponse.json(
        { success: false, error: "Person image and at least one product image are required" },
        { status: 400 }
      );
    }

    // Call the Virtual Try-On API
    console.log("=== Calling Virtual Try-On API ===");
    const result = await callVirtualTryOnAPI(body);
    console.log("=== API Result ===");
    console.log("Success:", result.success);
    console.log("Error:", result.error);

    if (!result.success) {
      console.error("API call failed:", result.error);
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    console.log("=== API call successful ===");
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
