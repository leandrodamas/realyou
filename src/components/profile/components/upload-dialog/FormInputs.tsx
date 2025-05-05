
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormInputsProps } from "./types";

export const FormInputs: React.FC<FormInputsProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  isUploading
}) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">Título *</label>
        <Input
          placeholder="Nome do trabalho"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isUploading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <Textarea
          placeholder="Descreva seu trabalho"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isUploading}
        />
      </div>
    </>
  );
};
