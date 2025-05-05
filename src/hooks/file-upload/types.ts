
export interface UploadOptions {
  bucketName: string;
  folder?: string;
  metadata?: Record<string, string>;
  isPublic?: boolean;
  anonymous?: boolean;
}

export interface FileUploadResult {
  publicUrl: string | null;
  filePath: string | null;
  error: Error | null;
}

export interface FileUploadState {
  isUploading: boolean;
  uploadProgress: number;
}
