import React, { useRef, useState } from 'react';
import { Camera, Eye, Trash2, Plus, Image as ImageIcon, Link as LinkIcon, Check } from 'lucide-react';

interface BlueprintImageSlotProps {
  imageUrl?: string;
  onUpdateImage: (url?: string) => void;
  onPreview: (url: string) => void;
  accentColor?: string;
  label?: string;
}

export const BlueprintImageSlot: React.FC<BlueprintImageSlotProps> = ({
  imageUrl,
  onUpdateImage,
  onPreview,
  accentColor = 'indigo',
  label = 'รูปภาพประกอบ',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEv) => {
      const dataUrl = loadEv.target?.result as string;
      if (dataUrl) {
        onUpdateImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleApplyUrl = () => {
    if (urlValue.trim()) {
      onUpdateImage(urlValue.trim());
      setUrlValue('');
      setShowUrlInput(false);
    }
  };

  if (imageUrl) {
    return (
      <div className="interactive-action relative group mt-1.5 rounded-lg overflow-hidden border border-slate-700/80 bg-slate-950/80">
        <img
          src={imageUrl}
          alt={label}
          className="w-full h-24 object-cover transition duration-200 group-hover:scale-105"
        />
        {/* Overlay controls */}
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 backdrop-blur-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(imageUrl);
            }}
            title="ดูรูปภาพขนาดเต็ม"
            className="p-1.5 rounded-full bg-slate-800/90 text-sky-300 hover:bg-sky-600 hover:text-white transition cursor-pointer shadow"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            title="เปลี่ยนรูปภาพ"
            className="p-1.5 rounded-full bg-slate-800/90 text-slate-200 hover:bg-indigo-600 hover:text-white transition cursor-pointer shadow"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUpdateImage(undefined);
            }}
            title="ลบรูปภาพ"
            className="p-1.5 rounded-full bg-slate-800/90 text-rose-300 hover:bg-rose-600 hover:text-white transition cursor-pointer shadow"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );
  }

  return (
    <div className="interactive-action mt-1.5">
      {showUrlInput ? (
        <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-lg border border-slate-700">
          <input
            type="text"
            placeholder="วางลิงก์รูปภาพ (URL)..."
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyUrl()}
            className="flex-1 px-1.5 py-0.5 bg-transparent text-[10px] text-white focus:outline-none"
            autoFocus
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="p-1 bg-indigo-600 text-white rounded text-[10px] hover:bg-indigo-500 cursor-pointer"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="p-1 text-slate-400 hover:text-white text-[10px] cursor-pointer"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="flex-1 py-1 px-2 rounded-md bg-slate-950/60 hover:bg-slate-800/80 border border-dashed border-slate-700/80 hover:border-slate-500 text-[10px] text-slate-300 flex items-center justify-center space-x-1 transition cursor-pointer group"
          >
            <Camera className="w-3 h-3 text-slate-400 group-hover:text-sky-400" />
            <span>+ แนบภาพ</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowUrlInput(true);
            }}
            title="ใส่ลิงก์รูป URL"
            className="p-1 rounded-md bg-slate-950/60 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};
