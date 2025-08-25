import React from 'react';

interface ChainLogoProps {
  chain: string;
  size?: number;
  className?: string;
}

const ChainLogo: React.FC<ChainLogoProps> = ({ chain, size = 12, className = '' }) => {
  // 链名称映射，支持多种格式
  const chainNameMap: Record<string, string> = {
    'binance-smart-chain': 'BNB Chain',
    'bsc': 'BNB Chain',
    'ethereum': 'Ethereum',
    'eth': 'Ethereum',
  };

  // 获取标准化的链名称
  const normalizedChain = chainNameMap[chain.toLowerCase()] || chain;

  // 链logo的SVG图标
  const chainIcons: Record<string, React.ReactNode> = {
    'ethereum': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#627EEA"/>
          <g fill="#FFF" fillRule="nonzero">
            <path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z"/>
            <path d="M16.498 4L9 16.22l7.498-3.35z"/>
            <path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z"/>
            <path d="M16.498 27.995v-6.028L9 17.616z"/>
            <path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/>
            <path fillOpacity=".602" d="M9 16.22l7.498 4.353v-7.701z"/>
          </g>
        </g>
      </svg>
    ),
    'binance-smart-chain': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
          <path fill="#FFF" d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.26L16 26l-6.144-6.144 2.26-2.26zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.886-3.886L16 10.52l-1.594 1.594-.666.666L16 13.854l3.886 3.886.666-.666L16 13.854z"/>
        </g>
      </svg>
    ),
    'Polygon': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#8247E5"/>
          <path fill="#FFF" d="M19.36 14.617c0-.386-.314-.7-.7-.7h-1.745c-.386 0-.7.314-.7.7v2.766c0 .386.314.7.7.7h1.745c.386 0 .7-.314.7-.7v-2.766zM16 6C10.477 6 6 10.477 6 16s4.477 10 10 10 10-4.477 10-10S21.523 6 16 6zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
        </g>
      </svg>
    ),
    'Bitcoin': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#F7931A"/>
          <path fill="#FFF" fillRule="nonzero" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.745-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.825.638.805 1.006l-1.256 5.038c.076.018.173.044.28.082-.09-.022-.186-.047-.282-.076l-1.78 7.138c-.136.342-.481.855-1.26.66.027.041-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-2.03-4.192 1.44-.332 2.527-1.28 2.817-3.24zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"/>
        </g>
      </svg>
    ),
    'Solana': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#000"/>
          <path fill="#00FFA3" fillRule="nonzero" d="M9.925 12.888h11.152c.49 0 .735.603.392.957l-5.576 5.576c-.196.196-.49.196-.686 0l-5.576-5.576c-.343-.354-.098-.957.392-.957z"/>
        </g>
      </svg>
    ),
    'Arbitrum': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#28A0F0"/>
          <path fill="#FFF" d="M16 4L4 16l12 12 12-12L16 4zm0 2.828L26.172 16 16 26.172 5.828 16 16 5.828z"/>
        </g>
      </svg>
    ),
    'Optimism': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#FF0420"/>
          <path fill="#FFF" d="M16 4L4 16l12 12 12-12L16 4zm0 2.828L26.172 16 16 26.172 5.828 16 16 5.828z"/>
        </g>
      </svg>
    ),
    'Avalanche': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#E84142"/>
          <path fill="#FFF" d="M16 4L4 16l12 12 12-12L16 4zm0 2.828L26.172 16 16 26.172 5.828 16 16 5.828z"/>
        </g>
      </svg>
    ),
    'Cardano': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#0033AD"/>
          <path fill="#FFF" d="M16 4L4 16l12 12 12-12L16 4zm0 2.828L26.172 16 16 26.172 5.828 16 16 5.828z"/>
        </g>
      </svg>
    ),
    'Polkadot': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#E6007A"/>
          <circle cx="16" cy="16" r="6" fill="#FFF"/>
        </g>
      </svg>
    ),
    'Cosmos': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#2E3148"/>
          <path fill="#FFF" d="M16 4L4 16l12 12 12-12L16 4zm0 2.828L26.172 16 16 26.172 5.828 16 16 5.828z"/>
        </g>
      </svg>
    ),
    'Chainlink': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#2A5ADA"/>
          <path fill="#FFF" d="M16 4L4 16l12 12 12-12L16 4zm0 2.828L26.172 16 16 26.172 5.828 16 16 5.828z"/>
        </g>
      </svg>
    ),
    'Uniswap': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#FF007A"/>
          <path fill="#FFF" d="M16 4L4 16l12 12 12-12L16 4zm0 2.828L26.172 16 16 26.172 5.828 16 16 5.828z"/>
        </g>
      </svg>
    ),
    'Litecoin': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#A6A9AA"/>
          <path fill="#FFF" fillRule="nonzero" d="M20.5 14.5l-1.5 6-6-1.5 1.5-6 6 1.5z"/>
        </g>
      </svg>
    ),
    'Dogecoin': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#C2A633"/>
          <path fill="#FFF" d="M16 4L4 16l12 12 12-12L16 4zm0 2.828L26.172 16 16 26.172 5.828 16 16 5.828z"/>
        </g>
      </svg>
    ),
    'Shiba Inu': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#E6A200"/>
          <path fill="#FFF" d="M16 4L4 16l12 12 12-12L16 4zm0 2.828L26.172 16 16 26.172 5.828 16 16 5.828z"/>
        </g>
      </svg>
    ),
    'Tron': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#FF0000"/>
          <path fill="#FFF" d="M16 4L4 16l12 12 12-12L16 4zm0 2.828L26.172 16 16 26.172 5.828 16 16 5.828z"/>
        </g>
      </svg>
    ),
    'Stellar': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#7D00FF"/>
          <path fill="#FFF" d="M16 4L4 16l12 12 12-12L16 4zm0 2.828L26.172 16 16 26.172 5.828 16 16 5.828z"/>
        </g>
      </svg>
    ),
    'Monero': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#FF6600"/>
          <path fill="#FFF" d="M16 4L4 16l12 12 12-12L16 4zm0 2.828L26.172 16 16 26.172 5.828 16 16 5.828z"/>
        </g>
      </svg>
    ),
    'Tezos': (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#2C7DF7"/>
          <path fill="#FFF" d="M16 4L4 16l12 12 12-12L16 4zm0 2.828L26.172 16 16 26.172 5.828 16 16 5.828z"/>
        </g>
      </svg>
    ),
  };

  const icon = chainIcons[normalizedChain];
  
  if (!icon) {
    // 如果没有找到对应的图标，显示默认的圆形背景
    return (
      <div 
        className={`bg-gray-300 rounded-full flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-gray-600 font-medium">
          {normalizedChain.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div 
      className={`rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {icon}
    </div>
  );
};

export default ChainLogo; 