
import React from "react";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const PaymentDialogFooter = () => {
  return (
    <DialogFooter className="pt-2 flex-col items-stretch space-y-2 sm:space-y-0">
      <div className="flex justify-end space-x-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancelar</Button>
        </DialogClose>
        <Button type="submit">Salvar Cartão</Button>
      </div>
    </DialogFooter>
  );
};
