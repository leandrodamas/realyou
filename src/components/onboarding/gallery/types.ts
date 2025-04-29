
export interface GalleryImage {
  id: string;
  preview: string;
}

export interface GalleryUploadZoneProps {
  onUpload: (files: FileList | null) => void;
  isUploading: boolean;
}

export interface GalleryInfoBoxProps {}

export interface GalleryGridProps {
  images: GalleryImage[];
  onRemoveImage: (id: string) => void;
}
