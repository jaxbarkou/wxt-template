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

export function updateTitle(thread_id: string, title: string) {
   const token = getStateValue("state.token");
  if (!token) return;
  return fetch(resolveServiceURL(`v1/chat/thread/title`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": token,
    },
    body: JSON.stringify({
      thread_id,
      title,
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


export function updateStarred(thread_id: string, starred: boolean) {
   const token = getStateValue("state.token");
  if (!token) return;
  return fetch(resolveServiceURL(`v1/chat/thread/starred`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": token,
    },
    body: JSON.stringify({
      thread_id,
      starred,
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

export function deleteThreads(thread_ids: string[]) {
   const token = getStateValue("state.token");
  if (!token) return;
  return fetch(resolveServiceURL(`v1/chat/thread/delete`), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": token,
    },
    body: JSON.stringify({
      thread_ids
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

