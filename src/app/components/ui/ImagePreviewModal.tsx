"use client";

import type { FC } from "react";

type ImagePreview = {
  url: string;
  name: string;
  username: string;
};

type ImagePreviewModalProps = {
  image: ImagePreview | null;
  onClose: () => void;
};

const ImagePreviewModal: FC<ImagePreviewModalProps> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-3xl px-4">
        <div className="mb-3 flex items-center justify-between text-xs text-neutral-100">
          <div className="flex flex-col">
            <span className="font-semibold truncate max-w-[16rem]">
              {image.name}
            </span>
            <span className="text-[11px] text-neutral-300">
              {image.username}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={image.url}
              download={image.name}
              className="rounded bg-neutral-100/90 px-3 py-1 text-[11px] font-medium text-neutral-900 hover:bg-white"
            >
              다운로드
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-neutral-800/90 px-3 py-1 text-[11px] text-neutral-100 hover:bg-neutral-700"
            >
              닫기
            </button>
          </div>
        </div>
        <div className="max-h-[80vh] rounded-lg bg-black overflow-hidden flex items-center justify-center">
          <img
            src={image.url}
            alt={image.name}
            className="max-h-[80vh] w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
