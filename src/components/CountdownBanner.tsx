'use client';

import React from 'react';
import { PromoBanner } from './PromoBanner';

export const CountdownBanner: React.FC = () => {
  return <PromoBanner promoCode="LUXE20" discountPercent={20} />;
};
