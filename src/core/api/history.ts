import { getStateValue } from "@/lib/utils";
import type { Thread, ThreadDetail } from "../history";
import { resolveServiceURL } from "./resolve-service-url";

export function queryHistoryMetadata(user_id: string, query?:string, type?: "all" | "starred") {
  const token = getStateValue("state.token");
  if (!token) return;
  return fetch(resolveServiceURL(`v1/chat/threads/${user_id}?query=${query || ''}&type=${type || 'all'}&offset=0&limit=100`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": token,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      return res.threads as Array<Thread>;
    })
    .catch(() => {
      return [];
    });
}

export function getThreadDetail(thread_id: string) {
   const token = getStateValue("state.token");
  if (!token) return;
  return fetch(resolveServiceURL(`v1/chat/thread/${thread_id}`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": token,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      return res as ThreadDetail;
    })
    .catch(() => {
      return null;
    });
}


export function updateThread(thread_id: string, title?: string, is_starred?: boolean) {
   const token = getStateValue("state.token");
  if (!token) return;
  return fetch(resolveServiceURL(`v1/chat/thread/${thread_id}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": token,
    },
    body: JSON.stringify({
      title,
      is_starred,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch(() => {
      return null;
    });
}

export function deleteThread(thread_id: string) {
   const token = getStateValue("state.token");
  if (!token) return;
  return fetch(resolveServiceURL(`v1/chat/thread/${thread_id}`), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": token,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch(() => {
      return null;
    });
}


export function getThreadStream(thread_id: string, last_event_id: string) {
   const token = getStateValue("state.token");
  if (!token) return;
  return fetch(resolveServiceURL(`v1/chat/stream`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": token,
      "Last-Event-ID": last_event_id
    },
    body: JSON.stringify({
      thread_id,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch(() => {
      return null;
    });
}

