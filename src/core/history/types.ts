

export interface Thread {
  id: number;
  user_id: string;
  title: string;
  created_at: number;
  thread_id: string;
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
  messages: ThreadMessage[];
  locale: string;
  research_topic: string;
  observations: Array<any>;
  resources: Array<any>;
  plan_iterations: number;
  current_plan: any;
  final_report: string;
  auto_accepted_plan: boolean;
  enable_background_investigation: boolean;
}