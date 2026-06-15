'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2, X, ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { uploadApi } from '@/lib/apiClient';
import { resolveMediaUrl } from '@/lib/avatarUrl';
import { toast } from 'sonner';

export function ImageUploadField({
  label = 'Cover image',
  hint = 'JPEG, PNG, WebP or GIF · max 5MB',
  value,
  onChange,
  token,
  disabled = false,
  optional = true,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setUploading(true);
    try {
      const data = await uploadApi.image(file, token);
      onChange(data.url || data.image || '');
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const preview = value ? resolveMediaUrl(value) : null;

  return (
    <div>
      <Label className="text-purple-200">
        {label}
        {optional && <span className="text-purple-500 font-normal"> (optional)</span>}
      </Label>
      <p className="text-purple-500 text-xs mt-1 mb-2">{hint}</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        disabled={disabled || uploading}
        onChange={handleFile}
      />

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-purple-500/20 bg-purple-950/30">
          <img src={preview} alt="Cover preview" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 right-3 flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
              className="bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4 mr-1" />}
              Change
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={disabled || uploading}
              onClick={() => onChange('')}
              className="bg-red-500/20 backdrop-blur border border-red-500/30 text-red-200 hover:bg-red-500/30"
            >
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled || uploading || !token}
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-purple-500/30 bg-white/5 hover:border-purple-400/50 hover:bg-white/[0.07] transition-all py-10 px-4 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-purple-400" />
            </div>
          )}
          <span className="text-purple-200 text-sm font-medium">
            {uploading ? 'Uploading...' : 'Tap to upload from device'}
          </span>
          <span className="text-purple-500 text-xs">or drag & drop an image here</span>
        </button>
      )}
    </div>
  );
}
