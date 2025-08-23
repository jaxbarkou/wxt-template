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
      console.error("Failed to get logs:", error);
    }
  }, []);

  useEffect(() => {
    getLog();
  }, [getLog]);

  return (
    <div className={`w-full ${mode === "popup" ? "p-4" : "p-8"}`}>
      <Link to="/">Back</Link>
      <h1 className="mb-6 text-2xl font-bold">Passkey Feature Test Page</h1>

      {/* Sidepanel环境特殊提示 */}
      {mode === "sidepanel" && (
        <div className="p-4 mb-6 border border-yellow-200 rounded-lg bg-yellow-50">
          <h3 className="mb-2 font-semibold text-yellow-800">
            ⚠️ Sidepanel Environment Limitations
          </h3>
          <p className="mb-3 text-sm text-yellow-700">
            WebAuthn functionality in Sidepanel environment
            is limited by browser restrictions, recommend testing in other environments:
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
                    alert("Please click the extension icon to open popup");
                  }
                } catch (error) {
                  alert("Please click the extension icon to open popup");
                }
              }}
              className="px-3 py-1 text-sm text-white bg-yellow-600 rounded hover:bg-yellow-700"
            >
              Test in Popup
            </button>
            <button
              onClick={() => {
                try {
                  chrome.runtime.openOptionsPage();
                } catch (error) {
                  alert("Please manually open the extension settings page");
                }
              }}
              className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Open Options Page
            </button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-xl font-bold">Passkey Feature Test</h2>
          <p className="mb-4 text-gray-600">
            Test complete Passkey registration and login flow, including backend API interaction.
            Supports multiple authenticator types, prioritizing platform authenticators (fingerprint/face recognition).
          </p>
          <PasskeyTest />
        </div>

        <div className="p-4 rounded-lg bg-blue-50">
          <h3 className="mb-2 font-bold">Test Instructions:</h3>
          <ul className="space-y-1 text-sm">
            <li>
              • <strong>Sidepanel Environment</strong>: WebAuthn
              functionality is limited by browser restrictions and cannot be used normally
            </li>
            <li>
              • <strong>Popup Environment</strong>: Can normally use WebAuthn functionality
            </li>
            <li>
              • <strong>Options Page</strong>: Independent tab environment, most suitable for testing
              WebAuthn
            </li>
            <li>
              • <strong>Content Script</strong>: Test on HTTPS-supported web pages
            </li>
            <li>
              • <strong>Platform Authenticator</strong>: Prioritize fingerprint/face recognition, more secure and convenient
            </li>
            <li>
              • <strong>Cross-platform Authenticator</strong>: Supports mobile QR code scanning, USB keys, etc.
            </li>
            <li>• Ensure device supports Passkey (such as Touch ID, Face ID, etc.)</li>
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
