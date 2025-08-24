import type { Thread, ThreadDetail } from "../history";
import { resolveServiceURL } from "./resolve-service-url";

export function queryHistoryMetadata(user_id: string) {
  return fetch(resolveServiceURL(`v1/chat/threads/${user_id}?offset=0&limit=100`), {
    method: "GET",
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
  return fetch(resolveServiceURL(`v1/chat/thread/${thread_id}`), {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      return res as ThreadDetail;
    })
    .catch(() => {
      return null;
    });
}

