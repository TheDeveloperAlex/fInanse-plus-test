'use client';

import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './Button';

const MAX_SIZE_BYTES = 1024 * 1024;
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];
const NBSP = ' ';

type LogoUploaderProps = {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
};

export function LogoUploader({ value, onChange }: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('PNG, JPG or SVG only');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('File must be 1 MB or smaller');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="flex items-center gap-3">
          {/* ADR-15: логотип (в т.ч. SVG) рендерится только через <img src>, никогда dangerouslySetInnerHTML */}
          {/* eslint-disable-next-line @next/next/no-img-element -- data URL от FileReader, next/image сюда не подходит */}
          <img
            src={value}
            alt="Logo preview"
            className="h-10 w-10 rounded-sm border border-border bg-surface object-contain"
          />
          <Button variant="ghost" onClick={() => onChange(null)}>
            <X className="size-3.5" />
            Remove
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            const file = event.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          className={`flex h-16 w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed text-xs text-ink-muted transition-colors ${
            dragOver ? 'border-border-strong bg-surface-hover' : 'border-border'
          }`}
        >
          <Upload className="size-4" />
          Drop logo or click to upload
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
          event.target.value = '';
        }}
      />
      {/* Всегда в DOM (только toggle invisible) — тот же приём, что и у
          предупреждения о контрасте в ColorField, чтобы место под ошибкой
          не дёргало разметку при появлении/исчезновении. */}
      <p className={`text-[11px] text-danger ${error ? '' : 'invisible'}`}>{error || NBSP}</p>
    </div>
  );
}
