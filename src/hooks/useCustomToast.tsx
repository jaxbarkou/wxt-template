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

type ToastType = "success" | "error" | "warning" | "info";

const bgMap: Record<ToastType, string> = {
  success: "border-[#0ECB81]",
  error: "border-[#F6465D]",
  warning: "border-[#F6A345]",
  info: "border-[#2878FF]",
};

const iconMap: Record<ToastType, ReactNode> = {
  success: <CircleCheck className="text-[#0ECB81] w-[30px] h-[30px] mr-5" />,
  error: <CircleX className="text-[#F6465D] w-[30px] h-[30px] mr-5" />,
  warning: <AlertCircle className="text-[#F6A345] w-[30px] h-[30px] mr-5" />,
  info: <Info className="text-[#2878FF] w-[30px] h-[30px] mr-5" />,
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
    console.log("Toast notification:", { message, type, duration }, toast);
    toast.custom(
      (t: any) => (
        <div
          className={`relative flex items-start w-[300px] p-3 bg-[#F6F6F8] text-white rounded-[8px] shadow-lg`}
        >
          <div className="flex items-center">
            {iconMap[type]}
            <div>
              <h4 className="text-lg font-semibold text-brand-black">
                {titleMap[type]}
              </h4>
              <span className="mt-2 text-sm text-brand-black">{message}</span>
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t)}
            className="absolute leading-none text-[20px] text-brand-black top-2 right-4 hover:opacity-75"
          >
            ×
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
