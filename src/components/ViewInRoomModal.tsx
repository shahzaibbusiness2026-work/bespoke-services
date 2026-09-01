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
    bgImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
    lightingTone: 'daylight',
    description: 'Chevron oak parquet with French wainscoting and natural window light.',
  },
  {
    id: 'penthouse-lounge',
    name: 'Manhattan Penthouse',
    category: 'Modern Living',
    bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    lightingTone: 'golden',
    description: 'Double-height ceiling, marble accents, and golden hour ambient warmth.',
  },
  {
    id: 'minimalist-studio',
    name: 'Minimalist Suite',
    category: 'Architectural',
    bgImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=80',
    lightingTone: 'gallery',
    description: 'Polished concrete, lime-wash textures, and directional gallery spotlights.',
  },
  {
    id: 'atelier-dressing',
    name: 'Atelier Dressing Room',
    category: 'Private Chamber',
    bgImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
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

  // Approximate real-world metric dimensions
  const getDimensions = () => {
    switch (arProduct.category) {
      case 'outerwear':
        return { height: '115 cm', width: '60 cm', depth: '15 cm', weight: '1.4 kg' };
      case 'bags':
        return { height: '34 cm', width: '42 cm', depth: '18 cm', weight: '0.85 kg' };
      case 'tailoring':
        return { height: '78 cm', width: '52 cm', depth: '12 cm', weight: '0.9 kg' };
      case 'footwear':
        return { height: '18 cm', width: '31 cm', depth: '11 cm', weight: '0.95 kg' };
      case 'accessories':
        return { height: '4.2 cm', width: '4.0 cm', depth: '1.1 cm', weight: '145 g' };
      case 'fragrance':
        return { height: '14 cm', width: '6.5 cm', depth: '6.5 cm', weight: '320 g' };
      default:
        return { height: '65 cm', width: '45 cm', depth: '25 cm', weight: '1.2 kg' };
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
          className="relative w-full max-w-6xl h-[92vh] max-h-[850px] bg-neutral-950 rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Flash Snapshot Effect */}
          {isFlashActive && (
            <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-in fade-in duration-75" />
          )}

          {/* Top Bar Navigation */}
          <div className="px-6 py-4 bg-neutral-900/90 border-b border-neutral-800 backdrop-blur-md flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-amber-400">
                    Atelier Spatial AR
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-neutral-400 font-mono">1:1 SCALE TRUE MATRIX</span>
                </div>
                <h3 className="font-serif text-lg text-white font-medium">
                  {arProduct.name} &bull; <span className="text-neutral-400 text-sm font-sans">{formatPrice(arProduct.price)}</span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Camera Feed Toggle */}
              <button
                id="ar-camera-toggle-btn"
                onClick={isCameraActive ? stopCamera : startCamera}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 border ${
                  isCameraActive
                    ? 'bg-emerald-500 text-white border-emerald-400'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isCameraActive ? 'Live Camera On' : 'Use Device Camera'}</span>
              </button>

              {/* Snapshot Capture Button */}
              <button
                id="ar-capture-snapshot-btn"
                onClick={handleCaptureSnapshot}
                className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full transition-colors border border-neutral-700"
                title="Capture Room Snapshot"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                id="ar-close-modal-btn"
                onClick={() => setIsAROpen(false)}
                className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-full transition-colors border border-neutral-700 ml-2"
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
                <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Floor Plane Calibrated &bull; {activeRoom.name}</span>
                </div>
              </div>
            )}

            {/* Draggable & Scalable 3D AR Product Object */}
            <div
              ref={stageRef}
              id="ar-draggable-product-stage"
              className="relative z-10 cursor-grab active:cursor-grabbing transition-shadow"
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
            >
              <div
                className="relative flex flex-col items-center transition-transform duration-75 ease-out"
                style={{
                  transform: `scale(${scale / 100}) rotate(${rotation}deg)`,
                }}
              >
                {/* Simulated Soft Ambient Shadow */}
                <div
                  className="absolute -bottom-8 w-4/5 h-8 bg-black/50 blur-xl rounded-full transform scale-y-50"
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
                <div className="mt-2 px-3 py-1 bg-black/75 backdrop-blur-md rounded-full border border-white/20 text-white text-[10px] font-mono tracking-wider flex items-center gap-1.5 shadow-lg">
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
                className="absolute top-6 left-6 z-20 px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white rounded-full text-xs flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-center Object</span>
              </button>
            )}
          </div>

          {/* Bottom Interactive AR Control Console */}
          <div className="bg-neutral-900 border-t border-neutral-800 p-4 sm:p-5 z-20 flex flex-col gap-4">
            {/* Nav tabs for bottom bar */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('room')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === 'room'
                      ? 'bg-neutral-100 text-neutral-950'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Spaces ({ROOM_PRESETS.length})
                </button>
                <button
                  onClick={() => setActiveTab('controls')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === 'controls'
                      ? 'bg-neutral-100 text-neutral-950'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Scale & Orbit
                </button>
                <button
                  onClick={() => setActiveTab('dimensions')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === 'dimensions'
                      ? 'bg-neutral-100 text-neutral-950'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Specs & Proportions
                </button>
              </div>

              {/* Color variant selectors */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-400 uppercase font-medium hidden sm:inline">
                  Finish:
                </span>
                {arProduct.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      selectedColor.name === c.name
                        ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-neutral-900 scale-110'
                        : 'border-neutral-600 hover:scale-105'
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
                    className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      activeRoom.id === room.id && !isCameraActive
                        ? 'bg-neutral-800 border-amber-400/60 shadow-lg'
                        : 'bg-neutral-950/60 hover:bg-neutral-800/60 border-neutral-800'
                    }`}
                  >
                    <img
                      src={room.bgImage}
                      alt={room.name}
                      className="w-11 h-11 rounded-xl object-cover shrink-0"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{room.name}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{room.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Tab 2: Spatial Scale & Orbit Controls */}
            {activeTab === 'controls' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-white">
                {/* Scale */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-neutral-400">
                    <span>Spatial Scale: {scale}%</span>
                    <button onClick={() => setScale(100)} className="underline text-amber-300">
                      100% (True 1:1)
                    </button>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={180}
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Rotation Orbit */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-neutral-400">
                    <span>Rotation: {rotation}°</span>
                    <button onClick={() => setRotation(0)} className="underline text-amber-300">
                      Frontal
                    </button>
                  </div>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Lighting ambience switch */}
                <div className="space-y-1.5">
                  <span className="text-neutral-400 block">Lighting Atmosphere:</span>
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
                        className={`py-1 text-[11px] rounded-lg font-medium transition-colors ${
                          lighting === tone.id
                            ? 'bg-amber-400 text-neutral-950 font-bold'
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
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
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-center">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Height</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{dims.height}</span>
                </div>
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-center">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Width</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{dims.width}</span>
                </div>
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-center">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Depth</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{dims.depth}</span>
                </div>
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-center">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Weight</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{dims.weight}</span>
                </div>
              </div>
            )}

            {/* Bottom Actions: Add to Bag or Wishlist */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <div className="text-xs text-neutral-400 hidden sm:block">
                <span>Selected: <strong>{arProduct.name}</strong> ({selectedColor.name})</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  id="ar-wishlist-toggle-btn"
                  onClick={() => toggleWishlist(arProduct.id)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isLiked
                      ? 'bg-rose-950/60 border-rose-600 text-rose-400'
                      : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-neutral-200'
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                <button
                  id="ar-add-to-bag-btn"
                  onClick={() => {
                    addToCart(arProduct, selectedColor, arProduct.sizes[0], 1);
                    setIsAROpen(false);
                  }}
                  className="flex-1 sm:flex-none px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
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
