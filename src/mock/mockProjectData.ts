import { ProjectData } from "@/modal/project";
const mockProjectData: ProjectData = {
  project_id: "proj_001",
  project_info: {
    name: "DeFiX",
    short_intro: "A next-generation DeFi protocol",
    logo: "https://example.com/logo.png",
    description:
      "DeFiX is a decentralized finance protocol providing yield farming and lending solutions.",
    team_info:
      "Founded by ex-Binance engineers with deep experience in blockchain and security.",
    sector_analysis:
      "DeFi lending and yield aggregation sector, with competitors like Aave and Compound.",
  },
  fundraising_info: {
    total_raised: "$50M",
    investors: [
      { name: "Sequoia Capital", logo: "https://example.com/sequoia.png" },
      { name: "a16z", logo: "https://example.com/a16z.png" },
    ],
    round_info: [
      {
        round: "Seed",
        amount: "$5M",
        date: "2021-05-01",
        other_details: "Led by Sequoia",
      },
      {
        round: "Series A",
        amount: "$20M",
        date: "2022-01-15",
        other_details: "Participated by a16z",
      },
      { round: "Series B", amount: "$25M", date: "2023-03-10" },
    ],
  },
  social_media_links: {
    website: "https://defix.io",
    twitter: "https://twitter.com/defix",
    defliama: "https://defillama.com/protocol/defix",
    telegram: "https://t.me/defix",
    discord: "https://discord.gg/defix",
    medium: "https://medium.com/@defix",
    github: "https://github.com/defix",
  },
  social_media_stats: {
    social_media_links: {
      twitter: "https://twitter.com/defix",
    },
    twitter: {
      followers: 120000,
      followers_7d_increment: 2500,
      mentions: 5000,
      mentions_7d_increment: 300,
      trend: [
        { timestamp: 1692000000, value: 115000 },
        { timestamp: 1692600000, value: 118000 },
        { timestamp: 1693200000, value: 120000 },
      ],
      sentiment: [60, 25, 15],
    },
    telegram: {
      members: 45000,
      members_7d_increment: 1200,
      trend: [
        { timestamp: 1692000000, value: 42000 },
        { timestamp: 1692600000, value: 43000 },
        { timestamp: 1693200000, value: 45000 },
      ],
    },
    discord: {
      members: 20000,
      members_7d_increase: 800,
      trend: [
        { timestamp: 1692000000, value: 19000 },
        { timestamp: 1692600000, value: 19500 },
        { timestamp: 1693200000, value: 20000 },
      ],
    },
    media_mentions: [
      "CoinDesk: DeFiX raises $25M in Series B",
      "The Block: DeFiX protocol hits $1B TVL",
    ],
  },
  on_chain_data: {
    tvl: 1000000000,
    tvl_7d_increment: 5.2,
    tvl_peak: 1500000000,
    tvl_trend: [
      { timestamp: 1692000000, value: 800000000 },
      { timestamp: 1692600000, value: 900000000 },
      { timestamp: 1693200000, value: 1000000000 },
    ],
    tvl_distribution: [
      { category: "Lending", value: 60 },
      { category: "Yield Farming", value: 30 },
      { category: "Others", value: 10 },
    ],
    active_addresses_7d: 150000,
    active_addresses_7d_change: 3.5,
    contract_interactions_7d: 500000,
    contract_interactions_7d_change: 4.2,
    contract_interactions_30d: 2000000,
    contract_interactions_trend: [
      { timestamp: 1692000000, value: 400000 },
      { timestamp: 1692600000, value: 450000 },
      { timestamp: 1693200000, value: 500000 },
    ],
    txns_30d: 3500000,
    protocol_revenue_30d: 2500000,
  },
  market_data: {
    token_price: 2.5,
    token_price_desc: "Price increased by 10% in the past week",
    trading_volume_24h: 12000000,
    trading_volume_24h_desc: "24h volume up 15%",
    circulating_market_cap: 250000000,
    circulating_market_cap_source: "CoinGecko",
    fully_diluted_valuation: 1000000000,
    fully_diluted_valuation_source: "CoinMarketCap",
    support_exchanges: [
      { name: "Binance", logo: "https://example.com/binance.png" },
      { name: "Coinbase", logo: "https://example.com/coinbase.png" },
    ],
  },
  tokenomics: {
    token_symbol: "DFX",
    circulating_supply: 100000000,
    total_supply: 500000000,
    support_chains: ["Ethereum", "BNB Chain", "Polygon"],
    support_chains_source: "Official docs",
    referral_docs: ["https://docs.defix.io/tokenomics"],
    distribution_overview:
      "40% community, 20% team, 20% investors, 20% ecosystem fund",
  },
  campaign: {
    campaign_title: "DeFiX Airdrop Campaign",
    participants: 50000,
    platforms: ["Galxe", "QuestN"],
    community_rewards:
      "5% of total supply distributed to campaign participants",
  },
};

export default mockProjectData;
