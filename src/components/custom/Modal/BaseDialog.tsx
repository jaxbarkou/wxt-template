"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface BaseDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  bgColor?: string;
  children: React.ReactNode;
}

export function BaseDialog({
  open,
  onOpenChange,
  bgColor = "#fff",
  children,
}: BaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("w-[320px] h-auto rounded-2 shadow-xl border-0")}
        style={{ backgroundColor: bgColor }}
      >
        <DialogTitle asChild>
          <VisuallyHidden></VisuallyHidden>
        </DialogTitle>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
