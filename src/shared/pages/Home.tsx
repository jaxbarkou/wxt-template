// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent2,
} from "@/components/base/dialog";
import { useStore } from "@/core/store";
import { AddChat } from "@/components/alia/icons/add-chat"
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";

import { MessagesBlock } from "../components/home/messages-block";
import { ResearchBlock } from "../components/home/research-block";
import { closeResearch } from "@/core/store";
import { ChatHistoryDialog } from "@/components/alia/chat-history-dialog";
import { useRootStore } from "@/store";

export default function Home() {
   const [searchParams] = useSearchParams();
  const openResearchId = useStore((state) => state.openResearchId);
  const { token } = useRootStore();
  const doubleColumnMode = useMemo(
    () => openResearchId !== null,
    [openResearchId],
  );

  const message = searchParams.get("message");
  
  const handleAddNewChat = () => {
    useStore.getState().clearMessages();
  };
  return (
    <div
      className={cn(
        "flex flex-col h-full w-full justify-center-safe p-4"
      )}
    >
      <div className="flex fill-destructive w-full gap-4 cursor-pointer">
        {token &&
          <>
            <div onClick={() => handleAddNewChat()}><AddChat/></div> 
            <ChatHistoryDialog/>
          </>
        }
      </div>
      <MessagesBlock
        className={cn("calc((100vw-538px) transition-all duration-300 ease-out")}
        askMessage={message}
      />
      <Dialog
        open={doubleColumnMode} 
        onOpenChange={() => {
          closeResearch();
        }}
      >
        <DialogContent2 className="h-[calc(100vh-50px)] p-1">
          <ResearchBlock
            className={cn(
              "pb-4 transition-all duration-300 ease-out",
              !doubleColumnMode && "scale-0",
              doubleColumnMode && "",
            )}
            researchId={openResearchId}
          />
        </DialogContent2>
      </Dialog>
    </div>
  );
}   
