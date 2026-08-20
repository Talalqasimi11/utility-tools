"use client";

import { useState, useEffect } from 'react';
import type { UploadedFile } from '@/types/upload';

interface PdfPageGridProps {
  file: UploadedFile;
  selectedPages?: number[];
  onTogglePage?: (pageIndex: number) => void;
  onLoadComplete?: (totalPages: number) => void;
  selectionMode?: 'remove' | 'extract' | 'rotate' | 'reorder' | 'watermark';
  rotations?: Record<number, number>;
  onRotatePage?: (index: number, direction: 1 | -1) => void;
  pageOrder?: number[];
  onReorder?: (newOrder: number[]) => void;
  watermarkPreview?: {
    text: string;
    fontSize: number;
    opacity: number;
    rotation: number;
    position: string;
  };
}

export default function PdfPageGrid({
  file,
  selectedPages = [],
  onTogglePage = () => {},
  onLoadComplete,
  selectionMode = 'remove',
  rotations = {},
  onRotatePage,
  pageOrder,
  onReorder,
  watermarkPreview,
}: PdfPageGridProps) {
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Drag & drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadThumbnails() {
      try {
        setLoading(true);
        // @ts-expect-error - pdfjs-dist build files lack .d.ts declarations
        const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const arrayBuffer = await file.file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdf.numPages;
        
        if (isMounted && onLoadComplete) {
          onLoadComplete(totalPages);
        }

        const generatedThumbnails: string[] = [];
        
        for (let i = 1; i <= totalPages; i += 5) {
          if (!isMounted) return;
          
          const batch = [];
          for (let j = 0; j < 5 && i + j <= totalPages; j++) {
            batch.push(
              (async () => {
                const page = await pdf.getPage(i + j);
                const viewport = page.getViewport({ scale: 0.5 });
                
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('No canvas context');
                
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                
                await page.render({ canvasContext: ctx, viewport }).promise;
                return canvas.toDataURL('image/jpeg', 0.6);
              })()
            );
          }
          
          const results = await Promise.all(batch);
          generatedThumbnails.push(...results);
          
          if (isMounted) {
            setThumbnails([...generatedThumbnails]);
          }
        }
      } catch (err) {
        console.error('Failed to generate thumbnails', err);
        if (isMounted) {
          setError('Failed to load PDF preview.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadThumbnails();

    return () => {
      isMounted = false;
    };
  }, [file]);

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-error-light border border-error text-error text-sm">
        {error}
      </div>
    );
  }

  // Use pageOrder if provided, otherwise default to 0, 1, 2... based on thumbnails loaded
  const displayIndices = pageOrder || thumbnails.map((_, i) => i);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (selectionMode !== 'reorder') return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
    
    // Create a generic drag image so it doesn't look weird
    const dragGhost = e.currentTarget.cloneNode(true) as HTMLElement;
    dragGhost.style.opacity = '0.5';
    dragGhost.style.position = 'absolute';
    dragGhost.style.top = '-1000px';
    document.body.appendChild(dragGhost);
    e.dataTransfer.setDragImage(dragGhost, 0, 0);
    setTimeout(() => document.body.removeChild(dragGhost), 0);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (selectionMode !== 'reorder') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent, index: number) => {
    if (selectionMode !== 'reorder') return;
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (selectionMode !== 'reorder') return;
    e.preventDefault();
    setDragOverIndex(null);
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    if (onReorder && pageOrder) {
      const newOrder = [...pageOrder];
      const [removed] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(dropIndex, 0, removed);
      onReorder(newOrder);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {loading && thumbnails.length === 0 && (
        <div className="flex items-center justify-center p-12 text-muted">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Generating preview...
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayIndices.map((origIndex, currentIndex) => {
          const thumb = thumbnails[origIndex];
          if (!thumb) return null; // Wait for it to load

          const isSelected = selectedPages.includes(origIndex);
          const rotation = (rotations[origIndex] || 0) % 360;
          const isRotated90or270 = rotation === 90 || rotation === -270 || rotation === 270 || rotation === -90;
          
          let containerClasses = `group relative aspect-[1/1.4] rounded-lg border-2 cursor-pointer transition-all overflow-hidden shadow-sm hover:shadow-md bg-muted/10 flex items-center justify-center `;
          
          if (selectionMode === 'remove') {
            containerClasses += isSelected ? 'border-error/50 opacity-60' : 'border-transparent hover:border-primary/50';
          } else if (selectionMode === 'extract') {
            containerClasses += isSelected ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent hover:border-primary/50 opacity-80 hover:opacity-100';
          } else if (selectionMode === 'rotate') {
            containerClasses += isSelected ? 'border-primary ring-2 ring-primary ring-offset-1' : 'border-transparent hover:border-primary/50';
          } else if (selectionMode === 'reorder') {
            containerClasses += 'border-transparent hover:border-primary/50 cursor-grab active:cursor-grabbing ';
            if (draggedIndex === currentIndex) {
              containerClasses += 'opacity-30 border-dashed border-primary ';
            }
            if (dragOverIndex === currentIndex) {
              // Highlight where it will be dropped
              containerClasses += draggedIndex !== null && draggedIndex < currentIndex ? 'border-r-4 border-r-primary ' : 'border-l-4 border-l-primary ';
            }
          }

          const imgStyle = {
            transform: `rotate(${rotation}deg) ${isRotated90or270 ? 'scale(0.714)' : 'scale(1)'}`,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          };

          return (
            <div 
              key={`page-${origIndex}-${currentIndex}`} 
              className={containerClasses}
              onClick={() => selectionMode !== 'reorder' && onTogglePage(origIndex)}
              draggable={selectionMode === 'reorder'}
              onDragStart={(e) => handleDragStart(e, currentIndex)}
              onDragOver={(e) => handleDragOver(e, currentIndex)}
              onDragLeave={(e) => handleDragLeave(e, currentIndex)}
              onDrop={(e) => handleDrop(e, currentIndex)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={thumb} 
                alt={`Page ${origIndex + 1}`} 
                style={imgStyle}
                className="w-full h-full object-contain pointer-events-none"
              />
              
              <div className={`absolute top-2 left-2 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded shadow-sm z-10 ${
                isSelected && (selectionMode === 'extract' || selectionMode === 'rotate') ? 'bg-primary text-white' : 'bg-background/80 text-foreground'
              }`}>
                {currentIndex + 1}
              </div>

              {isSelected && selectionMode === 'remove' && (
                <div className="absolute inset-0 bg-error/10 flex items-center justify-center z-10 pointer-events-none">
                  <div className="bg-error text-white rounded-full p-2 shadow-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              )}

              {isSelected && (selectionMode === 'extract' || selectionMode === 'rotate') && (
                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 shadow-sm z-10 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {selectionMode === 'reorder' && (
                <div className="absolute inset-0 bg-background/0 hover:bg-background/20 transition-colors z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-background/90 text-foreground p-2 rounded shadow-sm backdrop-blur-sm cursor-grab">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9h8M8 15h8" />
                    </svg>
                  </div>
                </div>
              )}
              
              {watermarkPreview && (!selectedPages.length || isSelected) && (
                <div className={`absolute inset-0 z-10 flex pointer-events-none overflow-hidden ${
                  watermarkPreview.position === 'top-left' ? 'items-start justify-start p-4' :
                  watermarkPreview.position === 'top-center' ? 'items-start justify-center p-4' :
                  watermarkPreview.position === 'bottom-center' ? 'items-end justify-center p-4' :
                  watermarkPreview.position === 'bottom-right' ? 'items-end justify-end p-4' :
                  'items-center justify-center'
                }`}>
                  <div 
                    style={{
                      opacity: watermarkPreview.opacity,
                      transform: `rotate(${-watermarkPreview.rotation}deg)`,
                      fontSize: `${Math.max(8, watermarkPreview.fontSize * 0.25)}px`,
                      color: '#000000',
                      whiteSpace: 'nowrap',
                      fontWeight: 'bold',
                      transformOrigin: 'center'
                    }}
                  >
                    {watermarkPreview.text}
                  </div>
                </div>
              )}
              
              {!isSelected && selectionMode === 'remove' && (
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-muted hover:text-error transition-colors p-1.5 rounded shadow-sm opacity-0 group-hover:opacity-100 sm:opacity-100 z-10 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
              )}

              {selectionMode === 'rotate' && onRotatePage && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button
                    onClick={(e) => { e.stopPropagation(); onRotatePage(origIndex, -1); }}
                    className="p-1.5 bg-background/90 hover:bg-primary text-foreground hover:text-white rounded shadow-sm transition-colors backdrop-blur-sm"
                    title="Rotate Left"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onRotatePage(origIndex, 1); }}
                    className="p-1.5 bg-background/90 hover:bg-primary text-foreground hover:text-white rounded shadow-sm transition-colors backdrop-blur-sm"
                    title="Rotate Right"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {loading && thumbnails.length > 0 && (
        <div className="flex items-center justify-center py-4 text-xs text-muted">
          <svg className="animate-spin -ml-1 mr-2 h-3 w-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading remaining pages...
        </div>
      )}
    </div>
  );
}
