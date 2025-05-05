
import { Dispatch, RefObject, SetStateAction } from "react";

export interface FileUploadAreaProps {
  selectedFile: File | null;
  previewUrl: string | null;
  fileInputRef: RefObject<HTMLInputElement>;
  isUploading: boolean;
  uploadProgress: number;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export interface FormInputsProps {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  isUploading: boolean;
}

export interface SessionStatusProps {
  session: any;
  isUploading: boolean;
  selectedFile: File | null;
  title: string;
  handleSubmit: () => Promise<void>;
}
