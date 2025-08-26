// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { useTranslations } from "@/hooks/useTranslations";
import { useState, useEffect } from "react";
import { Search, Trash2 } from "lucide-react";
import { History } from "@/components/alia/icons/history";
import { Collecte } from "@/components/alia/icons/collecte";
import {
    Dialog,
    DialogContentBottom,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/base/dialog";

import { cn, getStateValue } from "@/lib/utils";

import { Tooltip } from "./tooltip";
// import { DeleteAll } from "./icons/delete-all";
// import { Delete } from "./icons/delete";
import MoreActionsMenu from "./more-action";
import { queryHistoryMetadata, getThreadDetail } from "@/core/api/history";
// import { useRootStore } from "@/store";
import { Thread, ThreadMessage } from "@/core/history";
import dayjs from "dayjs";
import type { Message, MessageRole } from "@/core/messages";
import { appendMessage, useStore } from "@/core/store";
import { useRootStore } from "@/store";
import { get } from "lodash";

export function ChatHistoryDialog() {
    const t = useTranslations("chat.history");
    const [open, setOpen] = useState(false);
    const { token } = useRootStore();
    // const { userDetail } = useRootStore();
    const [threads, setThreads] = useState<Record<string, Thread[]>>({})

    function groupByDayTimestamp(data: Thread[]): Record<string, Thread[]> {
        return data.reduce((acc, item) => {
            const dayStart = Math.floor(item.created_at / 86400) * 86400;
            if (!acc[dayStart.toString()]) {
                acc[dayStart] = [];
            }
            acc[dayStart].push(item);

            return acc;
        }, {} as Record<string, Thread[]>);
    }
    const fetchHistoryMetadata = async () => {
        try {
            const user_id = getStateValue("state.userDetail.uid") || '__default__';
            const data = await queryHistoryMetadata(user_id)
            if (data && Array.isArray(data)) {
                console.log("history metadata:", data);
                const dataObj = groupByDayTimestamp(data);
                console.log("grouped history metadata:", dataObj);
                setThreads(dataObj);
            }
        } catch (error) {
            console.error("Error fetching history metadata:", error);
        }
    }

    function getRole(message: ThreadMessage) {
        if (message.type === "human") {
            return message.name === "reporter" ? "assistant" : "user";
        } else if (message.type === "ai") {
            return "assistant";
        } else if (message.type === "ai") {
            return "assistant";
        } else {
            return "assistant";
        }
    }
    function getAgent(message: ThreadMessage) {
        if (message.name === null && message.type === "ai") {
            return "coordinator"
        } else {
            return message.name as 
                | "coordinator"
                | "planner"
                | "researcher"
                | "coder"
                | "reporter"
                | "podcast"
        }
    }

    const handlethreadClick = async (thread: Thread) => {
        // console.log("thread clicked:", thread);
        try {
            useStore.getState().clearMessages();
            const data = await getThreadDetail(thread.thread_id)
            // const data = await getThreadDetail('WUVcMg7FKgnG2mR5NZSOn')
            console.log("thread detail:", data);
            let messages: Message[] = [];
            // let messageIds: string[] = [];
            if (data && data.messages && Array.isArray(data.messages)) {
                data.messages.forEach((message) => {
                    // console.log("message:", message);
                    // if (
                    //     message.name === "coder" ||
                    //     message.name === "reporter" ||
                    //     message.name === "researcher"
                    // ) {

                    // } else {
                        
                    // }
                    messages.push({
                        id: message.id,
                        threadId: thread.thread_id,
                        content: message.content,
                        agent: getAgent(message),
                        role: getRole(message) as MessageRole,
                        contentChunks: [],
                    } as Message)
                });
            }
            // console.log("messages:", messages);
            if (messages.length) {
                messages.forEach((m) => {
                    appendMessage(m)
                })
                useStore.getState().setThreadId(thread.thread_id);
            }
            setOpen(false)
        } catch (error) {
            console.error("Error fetching history metadata:", error);
        }
    }


    useEffect(() => {
        if (token) {
            fetchHistoryMetadata();
        }
   
    }, [token]);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip
                // className="max-w-60"
                title={t("title")}
            >
                <DialogTrigger asChild >
                    <div onClick={() => setOpen(true)}><History /></div>
                </DialogTrigger>
            </Tooltip>
            <DialogContentBottom className="h-[80%]">
                <DialogHeader className="flex flex-row">
                    <DialogTitle>
                        {t("chatHistory")}
                    </DialogTitle>
                    <p className="text-muted-foreground text-sm">
                        (0)
                    </p>
                </DialogHeader>
                <div className="flex flex-col h-full">
                    <div className="flex flex-col space-y-2 py-2">
                        <div className="flex items-center space-x-4 text-sm font-medium">
                            <button className="text-black border-b-2 border-black pb-1">
                                All
                            </button>
                            <button className="text-gray-500 hover:text-black pb-1">Starred</button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="relative w-full">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Email Address"
                                    className="w-full rounded-md border border-gray-300 pl-8 pr-2 py-1 text-sm focus:outline-none focus:ring-2 focus:#F67C00"
                                />
                            </div>
                            <button onClick={() => {}} className="p-2 rounded-md hover:text-red-500">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="h-[calc(100vh-22%)] overflow-y-auto">
                        {Object.keys(threads).sort((a, b) => Number(b) - Number(a) ).map((key) => (
                            <>
                                <div className="flex items-center justify-between">
                                    <p className="text-muted-foreground text-sm mt-2">
                                        {dayjs.unix(key as unknown as number).format('YYYY-MM-DD')}
                                    </p>
                                </div>
                                <div className="grid gap-1 py-2">
                                    {threads[key].map((thread, index) => {
                                        return (
                                            <button
                                                key={index}
                                                className={cn(
                                                    "hover:bg-accent flex items-start gap-3 rounded-lg p-4 text-left transition-colors bg-[#F3F3F3]",
                                                    // isSelected && "bg-[#FFF4E8]",
                                                )}
                                                onClick={() => handlethreadClick(thread)}
                                            >
                                                <div className="flex items-center justify-between w-full gap-2">
                                                    <div className="flex-1 space-y-1 ">
                                                        <h4 className="text-sm font-medium">{thread.title || `Chat${index}`}</h4>
                                                        <p className="text-muted-foreground text-sm max-w-[300px]  truncate">
                                                            No messages yet
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MoreActionsMenu />
                                                        <Collecte />
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        ))}
                        <div className=" bg-white p-4">
                            <p className="text-center text-sm mt-2">
                                No more history
                            </p>
                            <p className="text-center text-sm mt-2">
                                Only show sessions within 30 days
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContentBottom>
        </Dialog>
    );
}

