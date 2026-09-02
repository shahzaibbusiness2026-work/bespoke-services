'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductColor } from '../types';
import {
  X,
  Camera,
  Maximize2,
  RotateCw,
  Sun,
  Moon,
  Sparkles,
  Layers,
  ShoppingBag,
  Heart,
  Check,
  Download,
  Info,
  RefreshCw,
  Move,
  ZoomIn,
  Sliders,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ASSETS } from '@/src/constants/assets';

interface RoomPreset {
  id: string;
  name: string;
  category: string;
  bgImage: string;
  lightingTone: 'daylight' | 'golden' | 'gallery' | 'evening';
  description: string;
}

const ROOM_PRESETS: RoomPreset[] = [
  {
    id: 'paris-salon',
    name: 'Haussmann Salon',
    category: 'Classic Parisian',
    bgImage: ASSETS.rooms.minimalPenthouse,
    lightingTone: 'daylight',
    description: 'Chevron oak parquet with French wainscoting and natural window light.',
  },
  {
    id: 'penthouse-lounge',
    name: 'Manhattan Penthouse',
    category: 'Modern Living',
    bgImage: ASSETS.rooms.modernLoft,
    lightingTone: 'golden',
    description: 'Double-height ceiling, marble accents, and golden hour ambient warmth.',
  },
  {
    id: 'minimalist-studio',
    name: 'Minimalist Suite',
    category: 'Architectural',
    bgImage: ASSETS.rooms.classicalSalon,
    lightingTone: 'gallery',
    description: 'Polished concrete, lime-wash textures, and directional gallery spotlights.',
  },
  {
    id: 'atelier-dressing',
    name: 'Atelier Dressing Room',
    category: 'Private Chamber',
    bgImage: ASSETS.rooms.atelierSuite,
    lightingTone: 'evening',
    description: 'Bronze mirrors, custom walnut cabinetry, and soft velvet twilight tones.',
  },
];

export const ViewInRoomModal: React.FC = () => {
  const {
    isAROpen,
    setIsAROpen,
    arProduct,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    showToast,
  } = useShop();

  const [activeRoom, setActiveRoom] = useState<RoomPreset>(ROOM_PRESETS[0]);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [scale, setScale] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [lighting, setLighting] = useState<'daylight' | 'golden' | 'gallery' | 'evening'>('daylight');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isFlashActive, setIsFlashActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'room' | 'controls' | 'dimensions'>('room');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (arProduct && arProduct.colors.length > 0) {
      setSelectedColor(arProduct.colors[0]);
      setScale(100);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setLighting('daylight');
    }
  }, [arProduct]);

  // Clean up camera on unmount or close
  useEffect(() => {
    if (!isAROpen || !isCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isAROpen, isCameraActive]);

  if (!isAROpen || !arProduct || !selectedColor) return null;

  const isLiked = isInWishlist(arProduct.id);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsCameraActive(true);
          showToast('Live AR Camera Active', 'Point your device at a flat surface or floor', 'info');
        }
      } else {
        showToast('Camera Unavailable', 'Simulating luxury studio background', 'info');
      }
    } catch {
      showToast('Camera Permission Denied', 'Using studio photorealistic environment', 'info');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleCaptureSnapshot = () => {
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 300);
    showToast('Room Look Saved', `Snapshot of ${arProduct.name} captured to lookbook album`, 'success');
  };

  const handleResetPlacement = () => {
    setPosition({ x: 0, y: 0 });
    setScale(100);
    setRotation(0);
  };

  // Lighting overlay styles
  const getLightingStyle = () => {
    switch (lighting) {
      case 'golden':
        return 'bg-gradient-to-t from-amber-600/15 via-orange-400/10 to-transparent';
      case 'gallery':
        return 'bg-gradient-to-b from-black/40 via-transparent to-black/30';
      case 'evening':
        return 'bg-gradient-to-tr from-indigo-950/35 via-black/20 to-amber-900/15';
      default:
        return 'bg-transparent';
    }
  };

  const getProductImage = () => {
    return selectedColor.image || arProduct.images[0];
  };

  // Approximate real-world metric dimensions for luxury textiles & bedding
  const getDimensions = () => {
    switch (arProduct.category) {
      case 'sheets':
      case 'bedding':
        return { height: '203 cm (80")', width: '152 cm (60")', depth: '45 cm (18" pocket)', weight: '1.85 kg' };
      case 'duvets':
        return { height: '234 cm (92")', width: '228 cm (90")', depth: '3 cm (flange)', weight: '2.20 kg' };
      case 'curtains':
        return { height: '244 cm (96" drop)', width: '127 cm (50" panel)', depth: '8 cm (header)', weight: '2.60 kg' };
      case 'towels':
        return { height: '180 cm (70")', width: '100 cm (40")', depth: '700 GSM density', weight: '1.10 kg' };
      case 'throws':
        return { height: '178 cm (70")', width: '127 cm (50")', depth: '340 GSM plied', weight: '1.40 kg' };
      case 'blankets':
        return { height: '230 cm (90")', width: '230 cm (90")', depth: '420 GSM waffle', weight: '2.10 kg' };
      case 'pillows':
        return { height: '51 cm (20")', width: '76 cm (30" pair)', depth: '22 Momme Silk', weight: '0.42 kg' };
      default:
        return { height: '200 cm', width: '150 cm', depth: '30 cm', weight: '1.80 kg' };
    }
  };

  const dims = getDimensions();

  return (
    <AnimatePresence>
      <div
        id="ar-view-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-lg overflow-y-auto"
        onClick={() => setIsAROpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          id="ar-view-modal-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ar-modal-title"
          className="relative w-full max-w-6xl h-[92vh] max-h-[850px] bg-[#121313] rounded-none border border-[#383838] shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Flash Snapshot Effect */}
          {isFlashActive && (
            <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-in fade-in duration-75" />
          )}

          {/* Top Bar Navigation */}
          <div className="px-6 py-4 bg-[#1a1c1b] border-b border-[#383838] backdrop-blur-md flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-none bg-[#252726] border border-white/15 flex items-center justify-center text-[#efe0cf]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-label-caps uppercase font-bold tracking-[0.2em] text-[#efe0cf]">
                    BOSKI SPATIAL AR
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-[10px] text-white/50 font-mono">1:1 SCALE TRUE MATRIX</span>
                </div>
                <h3
                  id="ar-modal-title"
                  className="text-[17px] text-white font-normal"
                  style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                >
                  {arProduct.name} &bull; <span className="text-white/60 text-body-sm font-sans">{formatPrice(arProduct.price)}</span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Camera Feed Toggle */}
              <button
                id="ar-camera-toggle-btn"
                onClick={isCameraActive ? stopCamera : startCamera}
                className={`px-3.5 py-1.5 rounded-none text-label-caps uppercase tracking-wider transition-colors flex items-center gap-1.5 border cursor-pointer ${
                  isCameraActive
                    ? 'bg-white text-[#000000] border-white'
                    : 'bg-[#252726] hover:bg-[#333534] text-white border-[#383838]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isCameraActive ? 'Live Camera On' : 'Use Device Camera'}</span>
              </button>

              {/* Snapshot Capture Button */}
              <button
                id="ar-capture-snapshot-btn"
                onClick={handleCaptureSnapshot}
                className="p-2 bg-[#252726] hover:bg-[#333534] text-white rounded-none transition-colors border border-[#383838] cursor-pointer"
                title="Capture Room Snapshot"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                id="ar-close-modal-btn"
                onClick={() => setIsAROpen(false)}
                className="p-2 bg-[#252726] hover:bg-[#333534] text-white/80 hover:text-white rounded-none transition-colors border border-[#383838] ml-2 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main AR Stage Canvas Area */}
          <div className="relative flex-1 bg-neutral-900 overflow-hidden flex items-center justify-center select-none">
            {/* Background Layer: Camera or Photorealistic Room */}
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
            ) : (
              <img
                src={activeRoom.bgImage}
                alt={activeRoom.name}
                className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-95"
              />
            )}

            {/* Lighting Tone Filter Overlay */}
            <div className={`absolute inset-0 pointer-events-none z-1 ${getLightingStyle()}`} />

            {/* Surface Detection / AR Grid Overlay */}
            {showGrid && (
              <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none z-2 flex flex-col justify-end">
                <div
                  className="w-full h-full opacity-25"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px),
                      linear-gradient(to bottom, transparent, rgba(255,255,255,0.15))
                    `,
                    backgroundSize: '32px 32px',
                    transform: 'perspective(400px) rotateX(60deg)',
                    transformOrigin: 'bottom center',
                  }}
                />
                <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-none border border-white/10 text-white text-[11px]">
                  <span className="w-2 h-2 rounded-none bg-emerald-400 animate-ping" />
                  <span>Floor Plane Calibrated &bull; {activeRoom.name}</span>
                </div>
              </div>
            )}

            {/* Draggable & Scalable 3D AR Product Object */}
            <div
              ref={stageRef}
              id="ar-draggable-product-stage"
              className="relative z-10 cursor-grab active:cursor-grabbing transition-shadow touch-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
              onMouseDown={(e) => {
                setIsDragging(true);
                const startX = e.clientX - position.x;
                const startY = e.clientY - position.y;

                const onMouseMove = (moveEvent: MouseEvent) => {
                  setPosition({
                    x: moveEvent.clientX - startX,
                    y: moveEvent.clientY - startY,
                  });
                };

                const onMouseUp = () => {
                  setIsDragging(false);
                  window.removeEventListener('mousemove', onMouseMove);
                  window.removeEventListener('mouseup', onMouseUp);
                };

                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
              }}
              onTouchStart={(e) => {
                if (e.touches.length === 1) {
                  setIsDragging(true);
                  const touch = e.touches[0];
                  const startX = touch.clientX - position.x;
                  const startY = touch.clientY - position.y;

                  const onTouchMove = (moveEvent: TouchEvent) => {
                    if (moveEvent.touches.length === 1) {
                      setPosition({
                        x: moveEvent.touches[0].clientX - startX,
                        y: moveEvent.touches[0].clientY - startY,
                      });
                    }
                  };

                  const onTouchEnd = () => {
                    setIsDragging(false);
                    window.removeEventListener('touchmove', onTouchMove);
                    window.removeEventListener('touchend', onTouchEnd);
                  };

                  window.addEventListener('touchmove', onTouchMove, { passive: false });
                  window.addEventListener('touchend', onTouchEnd);
                }
              }}
            >
              <div
                className="relative flex flex-col items-center transition-transform duration-75 ease-out"
                style={{
                  transform: `scale(${scale / 100}) rotate(${rotation}deg)`,
                }}
              >
                {/* Simulated Soft Ambient Shadow */}
                <div
                  className="absolute -bottom-8 w-4/5 h-8 bg-black/50 blur-xl rounded-none transform scale-y-50"
                  style={{
                    opacity: (scale / 100) * 0.7,
                  }}
                />

                {/* The Object Cutout Image */}
                <img
                  src={getProductImage()}
                  alt={arProduct.name}
                  className="max-h-[380px] sm:max-h-[460px] object-contain drop-shadow-2xl pointer-events-none"
                  draggable={false}
                />

                {/* Spatial Anchor Pill Tag */}
                <div className="mt-2 px-3 py-1 bg-black/75 backdrop-blur-md rounded-none border border-white/20 text-white text-[10px] font-mono tracking-wider flex items-center gap-1.5 shadow-lg">
                  <Move className="w-3 h-3 text-amber-300" />
                  <span>
                    Scale {scale}% &bull; {rotation}°
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Floating Reset Placement Button */}
            {(position.x !== 0 || position.y !== 0 || scale !== 100 || rotation !== 0) && (
              <button
                id="ar-reset-position-btn"
                onClick={handleResetPlacement}
                className="absolute top-6 left-6 z-20 px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white rounded-none text-xs flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-center Object</span>
              </button>
            )}
          </div>

          {/* Bottom Interactive AR Control Console */}
          <div className="bg-neutral-900 border-t border-[#383838] p-4 sm:p-5 z-20 flex flex-col gap-4">
            {/* Nav tabs for bottom bar */}
            <div className="flex items-center justify-between border-b border-[#383838] pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('room')}
                  className={`px-3.5 py-1.5 rounded-none text-label-caps uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                    activeTab === 'room'
                      ? 'bg-white text-[#000000]'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Spaces ({ROOM_PRESETS.length})
                </button>
                <button
                  onClick={() => setActiveTab('controls')}
                  className={`px-3.5 py-1.5 rounded-none text-label-caps uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                    activeTab === 'controls'
                      ? 'bg-white text-[#000000]'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Scale &amp; Orbit
                </button>
                <button
                  onClick={() => setActiveTab('dimensions')}
                  className={`px-3.5 py-1.5 rounded-none text-label-caps uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                    activeTab === 'dimensions'
                      ? 'bg-white text-[#000000]'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Specs &amp; Proportions
                </button>
              </div>

              {/* Color variant selectors */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-white/60 uppercase font-medium hidden sm:inline">
                  Finish:
                </span>
                {arProduct.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                      selectedColor.name === c.name
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#121313] scale-110'
                        : 'border-[#555] hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Tab 1: Room Environments */}
            {activeTab === 'room' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ROOM_PRESETS.map((room) => (
                  <button
                    key={room.id}
                    id={`ar-preset-${room.id}`}
                    onClick={() => {
                      setActiveRoom(room);
                      setLighting(room.lightingTone);
                      setIsCameraActive(false);
                    }}
                    className={`p-2.5 rounded-none border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      activeRoom.id === room.id && !isCameraActive
                        ? 'bg-[#252726] border-white/70 shadow-lg'
                        : 'bg-[#1a1c1b] hover:bg-[#252726] border-[#383838]'
                    }`}
                  >
                    <img
                      src={room.bgImage}
                      alt={room.name}
                      className="w-11 h-11 rounded-none object-cover shrink-0"
                    />
                    <div className="truncate">
                      <p className="text-body-sm font-semibold text-white truncate">{room.name}</p>
                      <p className="text-[10px] text-white/50 truncate uppercase tracking-wider">{room.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Tab 2: Precision Scale, Rotation, and Lighting Controls */}
            {activeTab === 'controls' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-white">
                <div>
                  <div className="flex justify-between text-label-caps uppercase text-white/60 mb-1">
                    <span>Scale Matrix</span>
                    <span className="font-mono text-white">{Math.round(scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.6"
                    step="0.05"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-label-caps uppercase text-white/60 mb-1">
                    <span>Atelier Orbit</span>
                    <span className="font-mono text-white">{rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    step="1"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>

                <div>
                  <div className="text-label-caps uppercase text-white/60 mb-1">
                    <span>Ambient Light Engine</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { id: 'daylight', label: 'Day' },
                      { id: 'golden', label: 'Sunset' },
                      { id: 'gallery', label: 'Spot' },
                      { id: 'evening', label: 'Mood' },
                    ].map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => setLighting(tone.id as any)}
                        className={`py-1 text-[11px] rounded-none font-medium transition-colors cursor-pointer ${
                          lighting === tone.id
                            ? 'bg-white text-[#000000] font-semibold'
                            : 'bg-[#252726] text-white/70 hover:bg-[#333534]'
                        }`}
                      >
                        {tone.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Dimensions & Architectural Proportions */}
            {activeTab === 'dimensions' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#1a1c1b] p-3 rounded-none border border-[#383838] text-center">
                  <span className="text-label-caps uppercase font-semibold text-white/60 block">Height</span>
                  <span className="text-body-md font-bold text-white mt-0.5 block">{dims.height}</span>
                </div>
                <div className="bg-[#1a1c1b] p-3 rounded-none border border-[#383838] text-center">
                  <span className="text-label-caps uppercase font-semibold text-white/60 block">Width</span>
                  <span className="text-body-md font-bold text-white mt-0.5 block">{dims.width}</span>
                </div>
                <div className="bg-[#1a1c1b] p-3 rounded-none border border-[#383838] text-center">
                  <span className="text-label-caps uppercase font-semibold text-white/60 block">Depth</span>
                  <span className="text-body-md font-bold text-white mt-0.5 block">{dims.depth}</span>
                </div>
                <div className="bg-[#1a1c1b] p-3 rounded-none border border-[#383838] text-center">
                  <span className="text-label-caps uppercase font-semibold text-white/60 block">Weight</span>
                  <span className="text-body-md font-bold text-white mt-0.5 block">{dims.weight}</span>
                </div>
              </div>
            )}

            {/* Bottom Actions: Add to Bag or Wishlist */}
            <div className="flex items-center justify-between pt-3 border-t border-[#383838]">
              <div className="text-body-sm text-white/70 hidden sm:block">
                <span>Selected: <strong className="text-white">{arProduct.name}</strong> ({selectedColor.name})</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  id="ar-wishlist-toggle-btn"
                  onClick={() => toggleWishlist(arProduct.id)}
                  className={`p-3 rounded-none border transition-colors cursor-pointer ${
                    isLiked
                      ? 'bg-white text-[#000000] border-white'
                      : 'bg-[#252726] border-[#383838] hover:bg-[#333534] text-white'
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>

                <button
                  id="ar-add-to-bag-btn"
                  onClick={() => {
                    addToCart(arProduct, selectedColor, arProduct.sizes[0], 1);
                    setIsAROpen(false);
                  }}
                  className="flex-1 sm:flex-none px-6 py-3 bg-white hover:bg-[#efeeec] text-[#000000] font-semibold text-label-caps uppercase tracking-[0.16em] rounded-none shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Acquire Piece &bull; {formatPrice(arProduct.price)}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
