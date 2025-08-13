"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface BaseDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  title?: string;
  bgColor?: string;
  children: React.ReactNode;
}

export function BaseDialog({
  open,
  onOpenChange,
  title,
  bgColor = "#1F1F1F",
  children,
}: BaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("w-[480px] h-auto rounded-2 shadow-xl border-0")}
        style={{ backgroundColor: bgColor }}
      >
        {title ? (
          <DialogTitle className="p-5 border-b border-[#ADADAD]/20">
            <span className="text-white text-sm font-semibold">{title}</span>
          </DialogTitle>
        ) : (
          <DialogTitle asChild>
            <VisuallyHidden></VisuallyHidden>
          </DialogTitle>
        )}
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
