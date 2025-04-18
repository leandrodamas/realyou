
export interface WorkItem {
  id: string;
  image_path: string;
  title: string | null;
  description: string | null;
  likes: number;
  comments: number;
}

export interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
}
