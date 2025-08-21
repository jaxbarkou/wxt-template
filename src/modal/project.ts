// 项目信息
export interface ProjectInfo {
  /** Project name */
  name: string;
  /** Short introduction of the project */
  short_intro?: string;
  /** Project logo URL */
  logo?: string;
  /** Detailed project description */
  description?: string;
  /** Information about the project team */
  team_info?: string;
  /** Sector analysis */
  sector_analysis?: string;
}

// 投资者信息
export interface InvestorInfo {
  /** Investor name */
  name: string;
  /** Investor logo URL */
  logo?: string;
}

// 融资轮信息
export interface RoundInfo {
  /** Round name (e.g., Series A, Series B, etc.) */
  round?: string;
  /** Amount raised in this round */
  amount?: string;
  /** Date of fundraising */
  date?: string;
  /** Other details about the round */
  other_details?: string;
}

// 融资信息
export interface FundraisingInfo {
  /** Total amount raised */
  total_raised?: string;
  /** List of investors */
  investors: InvestorInfo[];
  /** Fundraising round information */
  round_info?: RoundInfo[];
}

// 社交媒体链接
export interface SocialMediaLinks {
  /** Official website */
  website?: string;
  /** Twitter link */
  twitter?: string;
  /** Defliama link */
  defliama?: string;
  /** Telegram link */
  telegram?: string;
  /** Discord link */
  discord?: string;
  /** Medium link */
  medium?: string;
  /** Github link */
  github?: string;
}

// 时间序列事件
export interface TimeSeriesEvent {
  /** Timestamp (seconds) */
  timestamp: number;
  /** Metric value */
  value: number;
}

// Twitter 数据
export interface TwitterStats {
  /** Number of Twitter followers */
  followers?: number;
  /** 7-day increment in followers */
  followers_7d_increment?: number;
  /** Number of Twitter mentions */
  mentions?: number;
  /** 7-day increment in mentions */
  mentions_7d_increment?: number;
  /** Trend event sequence */
  trend: TimeSeriesEvent[];
  /** Sentiment distribution: [positive, neutral, negative] */
  sentiment?: number[];
}

// Telegram 数据
export interface TelegramStats {
  /** Number of Telegram group members */
  members?: number;
  /** 7-day increment in members */
  members_7d_increment?: number;
  /** Trend event sequence */
  trend: TimeSeriesEvent[];
}

// Discord 数据
export interface DiscordStats {
  /** Number of Discord members */
  members?: number;
  /** 7-day increase in Discord members */
  members_7d_increase?: number;
  /** Trend event sequence */
  trend: TimeSeriesEvent[];
}

// 社交媒体统计
export interface SocialMedia {
  /** Social media links */
  social_media_links?: SocialMediaLinks;
  /** Twitter statistics */
  twitter?: TwitterStats;
  /** Telegram statistics */
  telegram?: TelegramStats;
  /** Discord statistics */
  discord?: DiscordStats;
  /** Media mentions */
  media_mentions: string[];
}

// TVL 分布
export interface TVLDistribution {
  /** Distribution category */
  category: string;
  /** Value */
  value: number;
}

// 链上数据
export interface OnChainData {
  tvl?: number;
  tvl_7d_increment?: number;
  tvl_peak?: number;
  tvl_trend: TimeSeriesEvent[];
  tvl_distribution: TVLDistribution[];
  active_addresses_7d?: number;
  active_addresses_7d_change?: number;
  contract_interactions_7d?: number;
  contract_interactions_7d_change?: number;
  contract_interactions_30d?: number;
  contract_interactions_trend: TimeSeriesEvent[];
  txns_30d?: number;
  protocol_revenue_30d?: number;
}

// 交易所信息
export interface ExchangeInfo {
  /** Exchange name */
  name: string;
  /** Exchange logo URL */
  logo?: string;
}

// 市场数据
export interface MarketData {
  token_price?: number;
  token_price_desc?: string;
  trading_volume_24h?: number;
  trading_volume_24h_desc?: string;
  circulating_market_cap?: number;
  circulating_market_cap_source?: string;
  fully_diluted_valuation?: number;
  fully_diluted_valuation_source?: string;
  support_exchanges: ExchangeInfo[];
}

// Tokenomics
export interface Tokenomics {
  token_symbol?: string;
  circulating_supply?: number;
  total_supply?: number;
  /** Supported chains (names, logos, addresses, etc.) */
  support_chains?: string[];
  support_chains_source?: string;
  referral_docs?: string[];
  distribution_overview?: string;
  distribution_details?: {
    community_launch?: {
      percentage: number;
      vesting: string;
    };
    ecosystem_growth?: {
      percentage: number;
      vesting: string;
    };
    dao_treasury?: {
      percentage: number;
      vesting: string;
    };
    investors?: {
      percentage: number;
      vesting: string;
    };
    public_sale?: {
      percentage: number;
      vesting: string;
    };
    team?: {
      percentage: number;
      vesting: string;
    };
  };
}

// 活动信息
export interface Campaign {
  campaign_title?: string;
  participants?: number;
  /** Campaign platforms, e.g., QuestN, Galxe, Layer3 */
  platforms?: string[];
  community_rewards?: string;
}

// 主项目数据
export interface ProjectData {
  /** Project ID */
  project_id: string;
  /** Project basic information */
  project_info: ProjectInfo;
  /** Fundraising information */
  fundraising_info?: FundraisingInfo;
  /** Social media links */
  social_media_links?: SocialMediaLinks;
  /** Social media statistics */
  social_media_stats?: SocialMedia;
  /** On-chain data statistics */
  on_chain_data?: OnChainData;
  /** Market data statistics */
  market_data?: MarketData;
  /** Tokenomics related information */
  tokenomics?: Tokenomics;
  /** Campaign related information */
  campaign?: Campaign;
}
