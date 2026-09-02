'use client';

import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Ruler,
  Scissors,
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Clock,
  ShieldCheck,
  Upload,
  Check,
} from 'lucide-react';

interface FabricOption {
  id: string;
  name: string;
  gsm: string;
  origin: string;
  basePricePerUnit: number;
  description: string;
  textureImage: string;
}

const FABRICS: FabricOption[] = [
  {
    id: 'belgian-flax',
    name: 'Belgian Flax Linen',
    gsm: '280 GSM',
    origin: 'Flanders, Belgium',
    basePricePerUnit: 1.45,
    description: 'Heavyweight pure flax with architectural acoustic dampening and natural light diffusion.',
    textureImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'french-flax',
    name: 'French Normandy Linen',
    gsm: '175 GSM',
    origin: 'Normandy, France',
    basePricePerUnit: 1.25,
    description: 'Stonewashed with organic mineral water for an effortless, supple lived-in drape.',
    textureImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'egyptian-sateen',
    name: 'Egyptian Cotton Sateen',
    gsm: '480 Thread Count',
    origin: 'Nile Delta, Egypt',
    basePricePerUnit: 1.15,
    description: 'Single-ply long-staple cotton woven in a luminous four-over-one sateen with quiet luster.',
    textureImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'silk-cashmere',
    name: 'Raw Silk & Cashmere Blend',
    gsm: '320 GSM',
    origin: 'Scottish & Andean Mills',
    basePricePerUnit: 2.10,
    description: 'Ultra-luxurious textured slub with supreme thermal regulation and whisper-soft weight.',
    textureImage: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=600&q=80',
  },
];

type ProjectType = 'curtains' | 'bedding' | 'duvets' | 'panels';

export const BespokeServicesPage: React.FC = () => {
  const { submitBespokeInquiry, showToast, formatPrice, isDarkMode } = useShop();

  // Estimator States
  const [projectType, setProjectType] = useState<ProjectType>('curtains');
  const [selectedFabric, setSelectedFabric] = useState<FabricOption>(FABRICS[0]);
  const [widthInches, setWidthInches] = useState<number>(100);
  const [dropInches, setDropInches] = useState<number>(108);
  const [pocketDepth, setPocketDepth] = useState<number>(18);
  const [headerStyle, setHeaderStyle] = useState<string>('French Triple Pinch Pleat');
  const [includeWeightedHems, setIncludeWeightedHems] = useState<boolean>(true);
  const [blackoutLining, setBlackoutLining] = useState<boolean>(true);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dynamic Calculation Engine
  const estimate = useMemo(() => {
    let baseArea = 0;
    let tailoringFee = 0;
    let hardwareExtras = 0;

    if (projectType === 'curtains') {
      const sqYards = (widthInches * dropInches) / 1296;
      baseArea = sqYards * 88;
      tailoringFee = 160;
      if (includeWeightedHems) hardwareExtras += 45;
      if (blackoutLining) hardwareExtras += 85;
    } else if (projectType === 'bedding') {
      const sqYards = (widthInches * dropInches) / 1296;
      baseArea = sqYards * 72;
      tailoringFee = 120;
      if (pocketDepth > 16) hardwareExtras += (pocketDepth - 16) * 12;
    } else if (projectType === 'duvets') {
      const sqYards = (widthInches * dropInches) / 1296;
      baseArea = sqYards * 80;
      tailoringFee = 140;
    } else {
      const sqYards = (widthInches * dropInches) / 1296;
      baseArea = sqYards * 95;
      tailoringFee = 180;
    }

    const fabricCost = baseArea * selectedFabric.basePricePerUnit;
    const total = Math.round(fabricCost + tailoringFee + hardwareExtras);

    return {
      fabricCost: Math.round(fabricCost),
      tailoringFee,
      hardwareExtras,
      finishingFee: hardwareExtras,
      total,
      leadTimeDays: projectType === 'panels' ? '14 - 18' : '10 - 14',
    };
  }, [projectType, selectedFabric, widthInches, dropInches, pocketDepth, includeWeightedHems, blackoutLining]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleTransferToForm = () => {
    const quoteSummary = `Bespoke Quote Estimate: ${formatPrice(estimate.total)}\n` +
      `Discipline: ${projectType.toUpperCase()}\n` +
      `Fabric: ${selectedFabric.name} (${selectedFabric.gsm})\n` +
      `Dimensions: Width ${widthInches}", Drop/Length ${dropInches}"` +
      (projectType === 'bedding' ? `, Pocket Depth: ${pocketDepth}"` : '') + `\n` +
      `Header/Finishing: ${headerStyle}` +
      (includeWeightedHems ? ' with Concealed Lead Weights' : '') +
      (blackoutLining ? ', Thermal Blackout Lining' : '');

    setFormData((prev) => ({
      ...prev,
      notes: prev.notes ? `${prev.notes}\n\n${quoteSummary}` : quoteSummary,
    }));

    document.getElementById('inquiry-form-section')?.scrollIntoView({ behavior: 'smooth' });
    showToast('Quote Transferred', 'Calculated specifications added to consultation form', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      showToast('Required fields missing', 'Please enter your name and email', 'info');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      submitBespokeInquiry({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        projectType,
        details: `Fabric: ${selectedFabric.name} | Dimensions: ${widthInches}" W x ${dropInches}" L`,
        fabric: selectedFabric.name,
        dimensions: `${widthInches}" W x ${dropInches}" L`,
        pocketDepth: projectType === 'bedding' ? `${pocketDepth}"` : undefined,
        headerStyle: projectType === 'curtains' ? headerStyle : undefined,
        includeWeightedHems,
        blackoutLining: projectType === 'curtains' ? blackoutLining : undefined,
        clientName: formData.fullName,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        notes: formData.notes,
        estimatedPrice: estimate.total,
        fileName: fileName || undefined,
        imageFileName: fileName || undefined,
      });

      setLoading(false);
      setSubmitted(true);
      setFormData({ fullName: '', email: '', phone: '', notes: '' });
      setFileName(null);
      showToast('Inquiry Submitted', 'Our atelier director will contact you within 24 hours', 'success');
    }, 1200);
  };

  return (
    <main className={`flex-grow flex flex-col pb-24 transition-colors ${
      isDarkMode ? 'bg-[#111312] text-[#FAF8F5]' : 'bg-[#faf9f7] text-[#1a1c1b]'
    }`}>
      {/* Hero Header */}
      <section className="w-full pt-16 md:pt-24 pb-12 px-5 md:px-16 text-center max-w-4xl mx-auto">
        <span className={`text-label-caps uppercase tracking-[0.25em] font-semibold mb-3 block ${
          isDarkMode ? 'text-[#C5A059]' : 'text-[#505252]'
        }`}>
          THE MASTER-LOOM ATELIER &bull; BESPOKE SERVICES
        </span>
        <h1
          className={`text-[38px] md:text-[64px] leading-[44px] md:leading-[72px] tracking-[-0.02em] mb-6 font-normal ${
            isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
          }`}
          style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
        >
          Made-to-Measure Estimator
        </h1>
        <p className={`text-body-lg max-w-2xl mx-auto font-light leading-relaxed ${
          isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
        }`}>
          From floor-to-ceiling architectural drapery drops to custom 24-inch fitted mattress depths.
          Configure your bespoke specifications below for an immediate precision quote.
        </p>
      </section>

      {/* Main Interactive Estimator Interface */}
      <section className="w-full px-5 md:px-16 max-w-[1440px] mx-auto mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Interactive Configuration Console (7 cols) */}
          <div className={`lg:col-span-7 space-y-10 p-6 sm:p-10 border shadow-xs ${
            isDarkMode ? 'bg-[#141615] border-[#2A2E2C]' : 'bg-white border-[#c4c7c7]'
          }`}>
            
            {/* 1. Project Type Selector */}
            <div>
              <div className={`flex items-center gap-2 mb-4 pb-2 border-b ${
                isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]/40'
              }`}>
                <Scissors className={`w-4 h-4 ${isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]'}`} />
                <h3 className={`text-label-caps uppercase font-bold tracking-[0.16em] ${
                  isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                }`}>
                  1. Select Bespoke Discipline
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'curtains', label: 'Architectural Drapery' },
                  { id: 'bedding', label: 'Deep Fitted Bedding' },
                  { id: 'duvets', label: 'Custom Duvet Sets' },
                  { id: 'panels', label: 'Acoustic Wall Panels' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProjectType(item.id as ProjectType)}
                    className={`py-3.5 px-3 text-center border text-[11.5px] uppercase font-semibold tracking-wider transition-all cursor-pointer rounded-none ${
                      projectType === item.id
                        ? isDarkMode
                          ? 'bg-[#C5A059] text-black border-[#C5A059] font-bold shadow-sm'
                          : 'bg-[#000000] text-white border-[#000000] shadow-sm'
                        : isDarkMode
                          ? 'bg-[#181B1A] text-[#A8A49C] border-[#2A2E2C] hover:border-[#C5A059] hover:text-[#FAF8F5]'
                          : 'bg-[#faf9f7] text-[#2b2d2c] border-[#c4c7c7] hover:border-black'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Fabric & Loom Selection */}
            <div>
              <div className={`flex items-center gap-2 mb-4 pb-2 border-b ${
                isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]/40'
              }`}>
                <Layers className={`w-4 h-4 ${isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]'}`} />
                <h3 className={`text-label-caps uppercase font-bold tracking-[0.16em] ${
                  isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                }`}>
                  2. Choose Master-Loom Fabric
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FABRICS.map((fabric) => (
                  <div
                    key={fabric.id}
                    onClick={() => setSelectedFabric(fabric)}
                    className={`p-4 border cursor-pointer transition-all rounded-none flex gap-4 ${
                      selectedFabric.id === fabric.id
                        ? isDarkMode
                          ? 'border-[#C5A059] bg-[#1C1F1D] ring-1 ring-[#C5A059]'
                          : 'border-[#000000] bg-[#faf9f7] ring-1 ring-black'
                        : isDarkMode
                          ? 'border-[#2A2E2C] hover:border-[#C5A059] bg-[#161817]'
                          : 'border-[#c4c7c7] hover:border-black bg-white'
                    }`}
                  >
                    <div className={`w-16 h-20 shrink-0 overflow-hidden border ${
                      isDarkMode ? 'bg-[#181B1A] border-[#383D3A]' : 'bg-[#efeeec] border-[#c4c7c7]/60'
                    }`}>
                      <img src={fabric.textureImage} alt={fabric.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <h4 className={`text-[13.5px] font-semibold truncate ${
                            isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                          }`}>{fabric.name}</h4>
                          {selectedFabric.id === fabric.id && (
                            <Check className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-[#C5A059]' : 'text-black'}`} />
                          )}
                        </div>
                        <p className={`text-[11px] font-mono mt-0.5 ${
                          isDarkMode ? 'text-[#C5A059]' : 'text-[#505252]'
                        }`}>{fabric.gsm} &bull; {fabric.origin}</p>
                      </div>
                      <p className={`text-[11.5px] line-clamp-2 mt-1 font-light leading-snug ${
                        isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
                      }`}>
                        {fabric.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Dimension Controls */}
            <div>
              <div className={`flex items-center gap-2 mb-4 pb-2 border-b ${
                isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]/40'
              }`}>
                <Ruler className={`w-4 h-4 ${isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]'}`} />
                <h3 className={`text-label-caps uppercase font-bold tracking-[0.16em] ${
                  isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                }`}>
                  3. Tailored Dimensions &amp; Finishing
                </h3>
              </div>

              <div className="space-y-6">
                {/* Width Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={`text-label-caps uppercase font-semibold ${
                      isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
                    }`}>
                      {projectType === 'curtains' ? 'Total Coverage Width' : 'Bed Width'}:
                    </label>
                    <span className={`text-body-sm font-mono font-bold ${
                      isDarkMode ? 'text-[#C5A059]' : 'text-black'
                    }`}>{widthInches} inches ({Math.round(widthInches * 2.54)} cm)</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={240}
                    step={2}
                    value={widthInches}
                    onChange={(e) => setWidthInches(Number(e.target.value))}
                    className={`w-full cursor-pointer ${isDarkMode ? 'accent-[#C5A059]' : 'accent-black'}`}
                  />
                  <div className={`flex justify-between text-[10.5px] mt-1 font-mono ${
                    isDarkMode ? 'text-[#6E6B65]' : 'text-[#505252]'
                  }`}>
                    <span>40" (Compact)</span>
                    <span>120" (Double)</span>
                    <span>240" (Expansive Villa)</span>
                  </div>
                </div>

                {/* Drop / Length Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={`text-label-caps uppercase font-semibold ${
                      isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
                    }`}>
                      {projectType === 'curtains' ? 'Finished Vertical Drop' : 'Bed Length'}:
                    </label>
                    <span className={`text-body-sm font-mono font-bold ${
                      isDarkMode ? 'text-[#C5A059]' : 'text-black'
                    }`}>{dropInches} inches ({Math.round(dropInches * 2.54)} cm)</span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={160}
                    step={2}
                    value={dropInches}
                    onChange={(e) => setDropInches(Number(e.target.value))}
                    className={`w-full cursor-pointer ${isDarkMode ? 'accent-[#C5A059]' : 'accent-black'}`}
                  />
                  <div className={`flex justify-between text-[10.5px] mt-1 font-mono ${
                    isDarkMode ? 'text-[#6E6B65]' : 'text-[#505252]'
                  }`}>
                    <span>60" (Standard Sill)</span>
                    <span>108" (High Ceiling)</span>
                    <span>160" (Grand Ballroom)</span>
                  </div>
                </div>

                {/* Deep Pocket Slider (Only for Bedding) */}
                {projectType === 'bedding' && (
                  <div className={`p-4 border ${
                    isDarkMode ? 'bg-[#181B1A] border-[#2A2E2C]' : 'bg-[#faf9f7] border-[#c4c7c7]'
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <label className={`text-label-caps uppercase font-bold ${
                        isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                      }`}>
                        Extra-Deep Mattress Pocket Depth:
                      </label>
                      <span className={`text-body-sm font-mono font-bold ${
                        isDarkMode ? 'text-[#C5A059]' : 'text-black'
                      }`}>{pocketDepth} inches ({Math.round(pocketDepth * 2.54)} cm)</span>
                    </div>
                    <input
                      type="range"
                      min={12}
                      max={24}
                      step={1}
                      value={pocketDepth}
                      onChange={(e) => setPocketDepth(Number(e.target.value))}
                      className={`w-full cursor-pointer ${isDarkMode ? 'accent-[#C5A059]' : 'accent-black'}`}
                    />
                    <p className={`text-[11px] mt-1.5 font-light ${
                      isDarkMode ? 'text-[#A8A49C]' : 'text-[#505252]'
                    }`}>
                      Accommodates pillow-top luxury mattresses, organic latex toppers, and custom bespoke frames up to 24" without slipping.
                    </p>
                  </div>
                )}

                {/* Header Style (For Curtains) */}
                {projectType === 'curtains' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      'French Triple Pinch Pleat',
                      'Architectural Ripplefold',
                      'Inverted Box Pleat',
                      'Tailored Rod Pocket',
                    ].map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setHeaderStyle(style)}
                        className={`py-2.5 px-3 text-left border text-[11.5px] uppercase font-semibold transition-all cursor-pointer rounded-none flex items-center justify-between ${
                          headerStyle === style
                            ? isDarkMode
                              ? 'border-[#C5A059] bg-[#1C1F1D] text-[#FAF8F5] font-bold'
                              : 'border-black bg-[#faf9f7] text-black font-bold'
                            : isDarkMode
                              ? 'border-[#2A2E2C] text-[#A8A49C] hover:border-[#C5A059]'
                              : 'border-[#c4c7c7] text-[#505252] hover:border-black'
                        }`}
                      >
                        <span>{style}</span>
                        {headerStyle === style && (
                          <Check className={`w-3.5 h-3.5 ${isDarkMode ? 'text-[#C5A059]' : 'text-black'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Feature Toggles */}
                <div className={`pt-2 flex flex-col sm:flex-row gap-4 border-t ${
                  isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]/30'
                }`}>
                  <label className={`flex items-center gap-2.5 cursor-pointer text-body-sm ${
                    isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                  }`}>
                    <input
                      type="checkbox"
                      checked={includeWeightedHems}
                      onChange={(e) => setIncludeWeightedHems(e.target.checked)}
                      className={`w-4 h-4 rounded-none cursor-pointer ${isDarkMode ? 'accent-[#C5A059]' : 'accent-black'}`}
                    />
                    <span>Hand-stitched European lead weighted corner hems</span>
                  </label>

                  {projectType === 'curtains' && (
                    <label className={`flex items-center gap-2.5 cursor-pointer text-body-sm ${
                      isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                    }`}>
                      <input
                        type="checkbox"
                        checked={blackoutLining}
                        onChange={(e) => setBlackoutLining(e.target.checked)}
                        className={`w-4 h-4 rounded-none cursor-pointer ${isDarkMode ? 'accent-[#C5A059]' : 'accent-black'}`}
                      />
                      <span>Triple-pass acoustic blackout lining</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Price Summary Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className={`text-white p-6 sm:p-8 border shadow-2xl rounded-none sticky top-28 ${
              isDarkMode ? 'bg-[#141615] border-[#2A2E2C]' : 'bg-[#1a1c1b] border-[#383838]'
            }`}>
              <div className={`flex items-center justify-between pb-4 mb-6 border-b ${
                isDarkMode ? 'border-[#2A2E2C]' : 'border-[#383838]'
              }`}>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-label-caps uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                    Bespoke Quote Summary
                  </span>
                </div>
                <span className="text-[11px] font-mono text-white/50">EST-ATELIER</span>
              </div>

              {/* Live Spec Breakdown */}
              <div className="space-y-3.5 mb-8 text-sm">
                <div className="flex justify-between items-center text-white/70">
                  <span>Discipline:</span>
                  <span className="text-white font-medium capitalize">{projectType}</span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Loom Selection:</span>
                  <span className="text-white font-medium">{selectedFabric.name}</span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Dimensions:</span>
                  <span className="text-white font-mono">{widthInches}" &times; {dropInches}"</span>
                </div>
                {projectType === 'bedding' && (
                  <div className="flex justify-between items-center text-white/70">
                    <span>Fitted Pocket Depth:</span>
                    <span className="text-white font-mono">{pocketDepth}" Extra-Deep</span>
                  </div>
                )}
                {projectType === 'curtains' && (
                  <div className="flex justify-between items-center text-white/70">
                    <span>Header Pleat:</span>
                    <span className="text-white font-medium">{headerStyle}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-white/70">
                  <span>Weighted Hemming:</span>
                  <span className="text-white">{includeWeightedHems ? 'Included (Hand-Stitched)' : 'Standard'}</span>
                </div>

                <div className={`pt-4 border-t space-y-2 text-[12.5px] text-white/60 ${
                  isDarkMode ? 'border-[#2A2E2C]' : 'border-[#383838]'
                }`}>
                  <div className="flex justify-between">
                    <span>Master Fabric Allocation:</span>
                    <span>{formatPrice(estimate.fabricCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Atelier Hand-Cutting &amp; Tailoring:</span>
                    <span>{formatPrice(estimate.tailoringFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Finishing &amp; Weights:</span>
                    <span>{formatPrice(estimate.finishingFee)}</span>
                  </div>
                </div>

                {/* Grand Total Row */}
                <div className={`pt-5 border-t flex justify-between items-baseline ${
                  isDarkMode ? 'border-[#2A2E2C]' : 'border-[#383838]'
                }`}>
                  <div>
                    <span className="text-label-caps uppercase text-[#C5A059] font-bold tracking-widest block">
                      Estimated Investment
                    </span>
                    <span className="text-[11px] text-white/50">Includes international insured crate</span>
                  </div>
                  <div className="text-right">
                    <span
                      className="text-[34px] font-normal text-white"
                      style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                    >
                      {formatPrice(estimate.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lead Time & Guarantee */}
              <div className={`p-3.5 border mb-6 flex items-center justify-between text-xs text-white/80 ${
                isDarkMode ? 'bg-[#181B1A] border-[#2A2E2C]' : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Lead Time: <strong className="text-white">{estimate.leadTimeDays} business days</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-white/60">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>Lifetime Guarantee</span>
                </div>
              </div>

              {/* Transfer CTA Button */}
              <button
                type="button"
                id="transfer-quote-btn"
                onClick={handleTransferToForm}
                className={`w-full py-4 text-label-caps uppercase tracking-wider font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-none ${
                  isDarkMode
                    ? 'bg-[#C5A059] text-black hover:bg-[#D8B468]'
                    : 'bg-white hover:bg-[#efe0cf] text-[#000000]'
                }`}
              >
                <span>Transfer Quote to Consultation Form</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="inquiry-form-section" className="w-full pb-16 px-5 md:px-16 max-w-3xl mx-auto">
        <div className={`p-8 md:p-12 border shadow-sm rounded-none ${
          isDarkMode ? 'bg-[#141615] border-[#2A2E2C]' : 'bg-white border-[#c4c7c7]'
        }`}>
          <div className={`mb-8 pb-4 border-b ${
            isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]'
          }`}>
            <h2
              className={`text-[28px] md:text-[34px] font-normal leading-tight mb-2 ${
                isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
              }`}
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              Artisan Consultation Request
            </h2>
            <p className={`text-body-sm font-light ${
              isDarkMode ? 'text-[#A8A49C]' : 'text-[#505252]'
            }`}>
              Submit your project details for formal fabric swatch dispatch and video consultation with our Master Draper.
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto stroke-1" />
              <h3
                className={`text-[26px] font-normal ${isDarkMode ? 'text-[#FAF8F5]' : 'text-black'}`}
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Consultation Confirmed
              </h3>
              <p className={`text-body-md max-w-md mx-auto font-light ${
                isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
              }`}>
                Thank you. Your bespoke inquiry and calculated estimate have been received. An artisan will reach out within 24 hours with tactile material swatches.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className={`mt-6 px-8 py-3.5 border text-label-caps uppercase transition-colors cursor-pointer rounded-none font-semibold ${
                  isDarkMode
                    ? 'border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black'
                    : 'border-black text-black hover:bg-black hover:text-white'
                }`}
              >
                Configure Another Piece
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-label-caps uppercase mb-1 font-semibold ${
                    isDarkMode ? 'text-[#C5A059]' : 'text-[#2b2d2c]'
                  }`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Victoria Kensington"
                    className={`w-full px-3.5 py-3 border text-body-sm outline-none rounded-none ${
                      isDarkMode
                        ? 'border-[#383D3A] bg-[#181B1A] text-[#FAF8F5] placeholder-[#6E6B65] focus:border-[#C5A059]'
                        : 'border-[#c4c7c7] bg-white text-black focus:border-black'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-label-caps uppercase mb-1 font-semibold ${
                    isDarkMode ? 'text-[#C5A059]' : 'text-[#2b2d2c]'
                  }`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="victoria@residence.com"
                    className={`w-full px-3.5 py-3 border text-body-sm outline-none rounded-none ${
                      isDarkMode
                        ? 'border-[#383D3A] bg-[#181B1A] text-[#FAF8F5] placeholder-[#6E6B65] focus:border-[#C5A059]'
                        : 'border-[#c4c7c7] bg-white text-black focus:border-black'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-label-caps uppercase mb-1 font-semibold ${
                  isDarkMode ? 'text-[#C5A059]' : 'text-[#2b2d2c]'
                }`}>
                  Telephone (For Private Courier Coordination)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 234-8921"
                  className={`w-full px-3.5 py-3 border text-body-sm outline-none rounded-none ${
                    isDarkMode
                      ? 'border-[#383D3A] bg-[#181B1A] text-[#FAF8F5] placeholder-[#6E6B65] focus:border-[#C5A059]'
                      : 'border-[#c4c7c7] bg-white text-black focus:border-black'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-label-caps uppercase mb-1 font-semibold ${
                  isDarkMode ? 'text-[#C5A059]' : 'text-[#2b2d2c]'
                }`}>
                  Project Notes &amp; Architectural Specifications
                </label>
                <textarea
                  rows={5}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Paste your calculated estimate specifications or describe window ceiling heights, crown molding clearances, or fabric preferences..."
                  className={`w-full p-3.5 border text-body-sm outline-none rounded-none resize-y ${
                    isDarkMode
                      ? 'border-[#383D3A] bg-[#181B1A] text-[#FAF8F5] placeholder-[#6E6B65] focus:border-[#C5A059]'
                      : 'border-[#c4c7c7] bg-white text-black focus:border-black'
                  }`}
                />
              </div>

              {/* Inspiration Image Upload */}
              <div>
                <label className={`block text-label-caps uppercase mb-2 font-semibold ${
                  isDarkMode ? 'text-[#C5A059]' : 'text-[#2b2d2c]'
                }`}>
                  Architectural Elevation / Floorplan (Optional)
                </label>
                {fileName ? (
                  <div className={`flex items-center justify-between p-3 border ${
                    isDarkMode ? 'bg-[#181B1A] border-[#2A2E2C]' : 'bg-[#faf9f7] border-[#c4c7c7]'
                  }`}>
                    <div className="flex items-center gap-2 truncate">
                      <Upload className={`w-4 h-4 ${isDarkMode ? 'text-[#C5A059]' : 'text-[#505252]'}`} />
                      <span className="text-xs font-mono truncate">{fileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFileName(null)}
                      className="text-xs text-red-500 hover:underline px-2 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className={`w-full py-8 px-4 border border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all rounded-none ${
                    isDarkMode
                      ? 'border-[#383D3A] hover:border-[#C5A059] hover:bg-[#181B1A]'
                      : 'border-[#c4c7c7] hover:border-black hover:bg-[#faf9f7]'
                  }`}>
                    <Upload className={`w-6 h-6 mb-2 ${isDarkMode ? 'text-[#C5A059]' : 'text-[#505252]'}`} />
                    <span className={`text-body-sm font-medium ${isDarkMode ? 'text-[#FAF8F5]' : 'text-black'}`}>
                      Upload Elevation, Window Photo or Blueprint
                    </span>
                    <span className={`text-[11px] ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#505252]'}`}>
                      PDF, PNG, or JPG up to 10MB
                    </span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <button
                type="submit"
                id="submit-bespoke-request-btn"
                disabled={loading}
                className={`w-full py-4 text-label-caps uppercase tracking-wider font-bold transition-colors cursor-pointer rounded-none disabled:opacity-70 ${
                  isDarkMode
                    ? 'bg-[#C5A059] text-black hover:bg-[#D8B468]'
                    : 'bg-[#000000] hover:bg-[#252726] text-white'
                }`}
              >
                {loading ? 'Submitting to Master Loom Director...' : 'Submit Bespoke Consultation Request'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Atmospheric Atelier Banner */}
      <section className="w-full px-5 md:px-16 max-w-[1440px] mx-auto">
        <div className={`relative aspect-[21/9] max-h-[360px] overflow-hidden border ${
          isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]'
        }`}>
          <img
            src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1920&q=80"
            alt="Atelier loom textile craft"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center p-6">
            <div className="max-w-xl space-y-2">
              <span className="text-label-caps uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
                HANDMADE IN CONTINENTAL EUROPE
              </span>
              <h3
                className="text-[26px] md:text-[36px] text-white font-normal"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Generational Weaves, Lifetime Enduring Beauty
              </h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
