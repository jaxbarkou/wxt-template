// Search API Response Modal
export interface SearchResult {
  code: number;
  message: string;
  data: SearchResultData;
}

export interface SearchResultData {
  total: number;
  list: ProjectItem[];
}

export interface ProjectItem {
  id: string;
  project_name: string;
  name?: string; // 兼容字段
  logo_url?: string;
  logo?: string; // 兼容字段
  brief_desc?: string;
  description?: string;
  tags?: string[];
  website_url?: string;
  website?: string; // 兼容字段
  twitter_username?: string;
  twitter?: string; // 兼容字段
  telegram_url?: string;
  telegram?: string; // 兼容字段
  discord_url?: string;
  discord?: string; // 兼容字段
  github_url?: string;
  github?: string; // 兼容字段
  medium_url?: string;
  gitbook_url?: string;
  defillama_url?: string;
  linkedin_url?: string;
  status?: string;
  establishment_date?: string;
  launch_date?: string;
  circulating_market_cap?: number;
  market_cap?: number; // 兼容字段
  fully_diluted_valuation?: number;
  price?: number;
  price_change_24h?: number;
  volume_24h?: number;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;
  rank?: number;
  score?: number;
  social_score?: number;
  developer_score?: number;
  liquidity_score?: number;
  public_interest_score?: number;
  market_sentiment?: string;
  risk_level?: string;
  audit_status?: string;
  kyc_status?: string;
  team_size?: number;
  funding_rounds?: FundingRound[];
  investors?: Investor[];
  partnerships?: Partnership[];
  competitors?: Competitor[];
  news?: NewsItem[];
  events?: Event[];
  roadmap?: RoadmapItem[];
  tokenomics?: TokenomicsInfo;
  technology?: TechnologyInfo;
  regulatory?: RegulatoryInfo;
  created_at?: string;
  updated_at?: string;
  // 新增字段
  token_symbol?: string;
  token_name?: string;
  has_token?: boolean;
  support_exchanges?: Array<{
    exchange_logo: string;
    exchange_name: string;
  }>;
  support_chains?: Array<{
    contract_address: string;
    contract_platform: string;
  }>;
  team_members?: any[];
  total_raised?: string | null;
  twitter_followers?: number | null;
  discord_members?: number | null;
  telegram_members?: number | null;
  questn_url?: string | null;
  questn_campaigns_count?: number | null;
  questn_participants_total?: number | null;
  rootdata_id?: number;
  rootdata_url?: string;
  rootdata_raw?: any;
}

export interface FundingRound {
  round: string;
  amount: number;
  currency: string;
  date: string;
  investors: string[];
  valuation: number;
}

export interface Investor {
  name: string;
  type: string;
  logo: string;
  website: string;
  investment_amount: number;
  investment_date: string;
}

export interface Partnership {
  partner_name: string;
  partner_logo: string;
  partnership_type: string;
  announcement_date: string;
  description: string;
  status: string;
}

export interface Competitor {
  name: string;
  logo: string;
  market_cap: number;
  price: number;
  description: string;
  website: string;
}

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  published_date: string;
  summary: string;
  sentiment: string;
}

export interface Event {
  title: string;
  type: string;
  date: string;
  description: string;
  status: string;
  url: string;
}

export interface RoadmapItem {
  quarter: string;
  year: number;
  title: string;
  description: string;
  status: string;
  completed_date?: string;
}

export interface TokenomicsInfo {
  token_symbol: string;
  token_name: string;
  token_type: string;
  blockchain: string;
  contract_address: string;
  decimals: number;
  initial_price: number;
  current_price: number;
  price_change_percentage: number;
  market_cap: number;
  fully_diluted_valuation: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  burned_tokens: number;
  locked_tokens: number;
  staking_apy: number;
  staking_requirements: string;
  vesting_schedule: VestingSchedule[];
  token_utility: string[];
  token_burn_mechanism: string;
  inflation_rate: number;
  deflation_rate: number;
}

export interface VestingSchedule {
  category: string;
  percentage: number;
  unlock_schedule: string;
  cliff_period: string;
  vesting_period: string;
  current_unlocked: number;
  remaining_locked: number;
}

export interface TechnologyInfo {
  blockchain: string;
  consensus_mechanism: string;
  transaction_speed: number;
  transaction_cost: number;
  scalability_solution: string;
  interoperability: string[];
  security_features: string[];
  smart_contract_language: string;
  api_availability: boolean;
  open_source: boolean;
  github_repository: string;
  documentation_url: string;
  technical_whitepaper: string;
  audit_reports: AuditReport[];
  bug_bounty_program: boolean;
  bug_bounty_url?: string;
}

export interface AuditReport {
  auditor: string;
  report_url: string;
  audit_date: string;
  score: string;
  findings: string[];
  status: string;
}

export interface RegulatoryInfo {
  jurisdiction: string;
  regulatory_status: string;
  compliance_certifications: string[];
  legal_opinion: string;
  regulatory_risks: string[];
  kyc_requirements: string;
  aml_compliance: boolean;
  tax_implications: string;
  regulatory_updates: RegulatoryUpdate[];
}

export interface RegulatoryUpdate {
  date: string;
  title: string;
  description: string;
  impact: string;
  source: string;
} 