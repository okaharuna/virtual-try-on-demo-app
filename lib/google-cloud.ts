import type { TryOnRequest, TryOnResponse } from "@/types";
import { getGoogleAuth } from "./google-auth";

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT;
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";

/**
 * Get Google Cloud access token from service account
 */
async function getAccessToken(): Promise<string> {
  try {
    const auth = await getGoogleAuth();
    const client = await auth.getClient();
    const token = await client.getAccessToken();

    if (!token.token) {
      throw new Error("Failed to get access token");
    }

    return token.token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw new Error("Failed to authenticate with Google Cloud");
  }
}

/**
 * Call Google Virtual Try-On API
 */
export async function callVirtualTryOnAPI(request: TryOnRequest): Promise<TryOnResponse> {
  if (!PROJECT_ID) {
    return {
      success: false,
      error: "GOOGLE_CLOUD_PROJECT environment variable is not set",
    };
  }

  try {
    const accessToken = await getAccessToken();

    const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/virtual-try-on-preview-08-04:predict`;

    // Extract base64 data from data URLs
    const personImageBase64 = request.personImage.includes(",")
      ? request.personImage.split(",")[1]
      : request.personImage;
    const productImageBase64 = request.productImages[0].includes(",")
      ? request.productImages[0].split(",")[1]
      : request.productImages[0];

    console.log("Person image base64 length:", personImageBase64?.length);
    console.log("Product image base64 length:", productImageBase64?.length);

    const payload = {
      instances: [
        {
          personImage: {
            image: {
              bytesBase64Encoded: personImageBase64,
            },
          },
          productImages: [
            {
              image: {
                bytesBase64Encoded: productImageBase64,
              },
            },
          ],
        },
      ],
      parameters: {
        sampleCount: request.sampleCount || 1,
      },
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error Response:", errorData);
      console.error("Request endpoint:", endpoint);
      console.error("Request payload:", JSON.stringify(payload, null, 2));
      return {
        success: false,
        error: `API request failed: ${response.status} ${response.statusText}\nDetails: ${errorData}`,
      };
    }

    const data = await response.json();

    if (!data.predictions || data.predictions.length === 0) {
      return {
        success: false,
        error: "No predictions returned from API",
      };
    }

    const images = data.predictions.map((pred: { bytesBase64Encoded: string }) => {
      return `data:image/png;base64,${pred.bytesBase64Encoded}`;
    });

    return {
      success: true,
      images,
    };
  } catch (error) {
    console.error("Virtual Try-On API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
