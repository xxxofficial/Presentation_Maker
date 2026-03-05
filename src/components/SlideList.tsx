// src/components/SlideList.tsx
import { useState, useRef } from "react";
import type { Slide } from "../types/api";
import { dispatch } from "../editor";
import { moveSlide } from "../types/api";

export default function SlideList({ slides, setCurrentSlideIndex }: { slides: Slide[]; setCurrentSlideIndex: (index: number) => void }) {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current == null || dragOverItem.current == null) return;
    if (dragItem.current === dragOverItem.current) return;

    // Перемещаем слайд
    dispatch(moveSlide, {
      fromIndex: dragItem.current,
      toIndex: dragOverItem.current
    });

    // Сбрасываем
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="slide-list">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${dragItem.current === index ? 'dragging' : ''}`}
          style={{
            opacity: dragItem.current === index ? 0.5 : 1,
            cursor: "grab",
            userSelect: "none"
          }}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragOver={(e) => e.preventDefault()} 
          onDragEnd={handleDragEnd}
          onClick={() => setCurrentSlideIndex(index)}
        >
          {slide.name || `Слайд ${index + 1}`}
        </div>
      ))}
    </div>
  );
}