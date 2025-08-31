import { Message } from "../messages";


export interface Thread {
  id: number;
  user_id: string;
  title: string;
  is_starred: boolean;
  thread_id: string;
  deleted: false;
  created_at: number;
}

export interface ThreadMessage {
  id: string;
  content: string;
  type: string;
  name: string;
  title: string;
  additional_kwargs: Record<string, unknown>;
  response_metadata: Record<string, unknown>;
}

export interface ThreadDetail {
  messages: Message[];
  is_agent_running: boolean;
  locale: string;
  // locale: string;
  // research_topic: string;
  // observations: Array<any>;
  // resources: Array<any>;
  // plan_iterations: number;
  // current_plan: any;
  // final_report: string;
  // auto_accepted_plan: boolean;
  // enable_background_investigation: boolean;
}