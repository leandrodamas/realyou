
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UploadDialogProps } from "../types/gallery";
import { useAuthSession } from "./upload-dialog/useAuthSession";
import { useFileHandler } from "./upload-dialog/useFileHandler";
import { useWorkSubmit } from "./upload-dialog/useWorkSubmit";
import { FormInputs } from "./upload-dialog/FormInputs";
import { FileUploadArea } from "./upload-dialog/FileUploadArea";
import { SessionStatus } from "./upload-dialog/SessionStatus";

export const UploadWorkDialog: React.FC<UploadDialogProps> = ({ 
  open, 
  onOpenChange,
  onUploadSuccess 
}) => {
  const { session } = useAuthSession(open);
  const {
    selectedFile,
    previewUrl,
    fileInputRef,
    handleFileSelect,
    resetFileInput
  } = useFileHandler();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    resetFileInput();
  };

  const {
    title,
    setTitle,
    description,
    setDescription,
    isUploading,
    uploadProgress,
    handleSubmit: submitWork
  } = useWorkSubmit(onUploadSuccess, onOpenChange, resetForm);

  const handleSubmit = async () => {
    await submitWork(selectedFile, session);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Trabalho</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <FormInputs
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            isUploading={isUploading}
          />
          
          <FileUploadArea
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            fileInputRef={fileInputRef}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            onFileSelect={handleFileSelect}
            onRemove={resetFileInput}
          />
          
          <SessionStatus
            session={session}
            isUploading={isUploading}
            selectedFile={selectedFile}
            title={title}
            handleSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
