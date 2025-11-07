export interface TryOnRequest {
  personImage: string;
  productImages: string[];
  sampleCount?: number;
  baseSteps?: number;
}

export interface TryOnResponse {
  success: boolean;
  images?: string[];
  error?: string;
}

export interface ImageUploadState {
  personImage: string | null;
  productImage: string | null;
}
