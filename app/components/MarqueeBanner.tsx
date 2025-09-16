'use client';

import React from 'react';

const MarqueeBanner = () => {
  return (
    <div className="bg-yellow-400 text-black py-2 px-4 overflow-hidden">
      <div className="marquee">
        <span className="font-medium">
          🌟 Special Offer: Professional Tailoring Services Available! Get your clothes stitched with perfect fit and style. Visit us today! 🌟
        </span>
      </div>
      <style jsx>{`
        .marquee {
          white-space: nowrap;
          animation: marquee 20s linear infinite;
          display: inline-block;
          padding-left: 100%;
          animation-fill-mode: forwards;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default MarqueeBanner;
