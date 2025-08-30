// hooks/useCustomToast.ts
import { toast } from "sonner";
import { ReactNode } from "react";

// import {
//   StateSuccess,
//   StateWarning,
//   StateError,
//   StateInfo,
// } from "@/components/custom/svg";
import { CircleCheck, CircleX, AlertCircle, Info } from "lucide-react";
import { X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

const bgMap: Record<ToastType, string> = {
  success: "bg-[#0ECB81]",
  error: "bg-[#F6465D]",
  warning: "bg-[#F6A345]",
  info: "bg-[#2878FF]",
};

const iconMap: Record<ToastType, ReactNode> = {
  success: <CircleCheck className="text-[#0ECB81] w-[30px] h-[30px] mr-2.5" />,
  error: <CircleX className="text-[#F6465D] w-[30px] h-[30px] mr-2.5" />,
  warning: <AlertCircle className="text-[#F6A345] w-[30px] h-[30px] mr-2.5" />,
  info: <Info className="text-[#2878FF] w-[30px] h-[30px] mr-2.5" />,
};

const titleMap: Record<ToastType, string> = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  info: "Info",
};

export function useCustomToast() {
  function notify({
    message,
    type = "info",
    duration = 3000,
  }: {
    message: ReactNode;
    type?: ToastType;
    duration?: number;
  }) {
    toast.custom(
      (t: any) => (
        <div
          className={`absolute right-[-10px] flex items-stretch items-start rounded-lg w-[240px] bg-[#fff] text-white rounded-[8px] [box-shadow:0_0_2px_0_rgba(255,255,255,0.10)] border border-[#E9E9E9]`}
        >
          <div
            className={`absolute left-0 top-0 bottom-0 w-[6px] h-full rounded-l-lg ml-[-2px] ${bgMap[type]}`}
          />
          <div className="flex items-center flex-1 p-3">
            {iconMap[type]}
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-brand-black leading-[1]">
                {titleMap[type]}
              </h4>
              <span className="mt-1 text-[10px] text-brand-black leading-[1]">
                {message}
              </span>
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t)}
            className="absolute leading-none text-[20px] text-brand-black top-2 right-2 hover:opacity-75"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ),
      {
        duration,
        position: "top-right",
      }
    );
  }

  return { notify };
}
