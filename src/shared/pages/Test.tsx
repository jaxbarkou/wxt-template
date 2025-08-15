import React, { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { PasskeyTest } from "@/shared/components";
import { getOperateLog } from "@/lib/api/user";
import { OperateLog } from "@/modal/user";
import { UserIcon } from "@/components/custom/svg";
import { Button } from "@/components/ui/button";
import { BaseDialog } from "@/components/custom/Modal/BaseDialog";
import { useMode } from "../context/ModeProvider";

const Test: React.FC= () => {
  const [logList, setLogList] = React.useState<OperateLog[]>([]);
  const [open, setOpen] = React.useState(false);
  const { mode } = useMode();
  const getLog = useCallback(async () => {
    try {
      let res = await getOperateLog();
      if (res.code === 1) {
        setLogList(res.result || []);
      }
    } catch (error) {
      console.error("获取日志失败:", error);
    }
  }, []);

  useEffect(() => {
    getLog();
  }, [getLog]);

  return (
    <div className={`w-full ${mode === "popup" ? "p-4" : "p-8"}`}>
      <Link to="/">返回</Link>
      <h1 className="mb-6 text-2xl font-bold">Passkey 功能测试页面</h1>

      {/* Sidepanel环境特殊提示 */}
      {mode === "sidepanel" && (
        <div className="p-4 mb-6 border border-yellow-200 rounded-lg bg-yellow-50">
          <h3 className="mb-2 font-semibold text-yellow-800">
            ⚠️ Sidepanel 环境限制
          </h3>
          <p className="mb-3 text-sm text-yellow-700">
            Sidepanel 环境中的 WebAuthn
            功能受到浏览器限制，建议在其他环境中测试：
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                try {
                  if (
                    chrome.action &&
                    typeof chrome.action.openPopup === "function"
                  ) {
                    chrome.action.openPopup();
                  } else {
                    alert("请点击扩展图标打开弹窗");
                  }
                } catch (error) {
                  alert("请点击扩展图标打开弹窗");
                }
              }}
              className="px-3 py-1 text-sm text-white bg-yellow-600 rounded hover:bg-yellow-700"
            >
              在 Popup 中测试
            </button>
            <button
              onClick={() => {
                try {
                  chrome.runtime.openOptionsPage();
                } catch (error) {
                  alert("请手动打开扩展设置页面");
                }
              }}
              className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              打开 Options 页面
            </button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-xl font-bold">Passkey 功能测试</h2>
          <p className="mb-4 text-gray-600">
            测试完整的Passkey注册和登录流程，包括与后端API的交互。
            支持多种认证器类型，优先使用平台认证器（指纹/面容识别）。
          </p>
          <PasskeyTest />
        </div>

        <div className="p-4 rounded-lg bg-blue-50">
          <h3 className="mb-2 font-bold">测试说明：</h3>
          <ul className="space-y-1 text-sm">
            <li>
              • <strong>Sidepanel 环境</strong>：WebAuthn
              功能受到浏览器限制，无法正常使用
            </li>
            <li>
              • <strong>Popup 环境</strong>：可以正常使用 WebAuthn 功能
            </li>
            <li>
              • <strong>Options 页面</strong>：独立标签页环境，最适合测试
              WebAuthn
            </li>
            <li>
              • <strong>Content Script</strong>：在支持 HTTPS 的网页中测试
            </li>
            <li>
              • <strong>平台认证器</strong>：优先使用指纹/面容识别，更安全便捷
            </li>
            <li>
              • <strong>跨平台认证器</strong>：支持手机扫码、USB密钥等
            </li>
            <li>• 确保设备支持 Passkey（如 Touch ID、Face ID 等）</li>
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <h3>test-UI</h3>
        <span className="text-brand-primary">text-brand-primary</span>
        <span className="text-brand-red">text-brand-red</span>
        <UserIcon color="#ddd" hoverColor="#000"></UserIcon>
        <Button
          onClick={() => setOpen(true)}
          className="flex-1 h-8 rounded-[40px] font-medium text-sm"
        >
          dialog
        </Button>

        <BaseDialog open={open} onOpenChange={setOpen}>
          <div>BaseDialogBaseDialog</div>
          <Button
            onClick={() => setOpen(false)}
            className="flex-1 h-8 rounded-[40px] font-medium text-sm"
          >
            close
          </Button>
        </BaseDialog>
      </div>
    </div>
  );
};

export default Test;
