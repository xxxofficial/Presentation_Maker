// src/components/Element.tsx
import { useRef, useState, useEffect } from "react";
import type { SlideObject, ResizeCorner } from "../types/api";
import { dispatch } from "../editor";
import { moveObject, resizeObject } from "../types/api";

type ElementProps = {
  obj: SlideObject;
  slideId: string;
  isSelected?: boolean;
  toggleSelectObject?: (id: string, isShift: boolean) => void;
};

export default function Element({ 
  obj, 
  slideId, 
  isSelected = false, 
  toggleSelectObject 
}: ElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [resizing, setResizing] = useState<{ corner: ResizeCorner; startX: number; startY: number } | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (toggleSelectObject) {
      toggleSelectObject(obj.id, e.shiftKey);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!ref.current || resizing) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      dispatch(moveObject, { slideId, objectId: obj.id, x: Math.round(x), y: Math.round(y) });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    setIsDragging(true);
  };

  const startResize = (e: React.MouseEvent, corner: ResizeCorner) => {
    e.stopPropagation();
    setResizing({ corner, startX: e.clientX, startY: e.clientY });
  };

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      dispatch(resizeObject, {
        slideId,
        objectId: obj.id,
        corner: resizing.corner,
        deltaX: e.clientX - resizing.startX,
        deltaY: e.clientY - resizing.startY
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setResizing(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: obj.position.x,
        top: obj.position.y,
        width: obj.type === "text" ? "auto" : obj.size.width,
        height: obj.type === "text" ? obj.fontSize : obj.size.height,
        border: isSelected ? "2px solid #1d4ed8" : "1px dashed #aaa",
        boxShadow: isSelected ? "0 0 0 2px rgba(29, 78, 216, 0.3)" : "none",
        padding: "4px",
        background: "#fff8",
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: isDragging || resizing ? 1000 : 1,
        userSelect: "none"
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick} 
    >
      {obj.type === "text" ? (
        <span style={{ fontSize: obj.fontSize, fontFamily: obj.fontFamily, color: obj.color }}>
          {obj.content}
        </span>
      ) : (
        <img
          src={obj.src || "https://via.placeholder.com/150"}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {obj.type === "image" && !isDragging && !resizing && (
        <>
          <div style={resizeHandleStyle('top-left')} onMouseDown={(e) => startResize(e, 'top-left')} />
          <div style={resizeHandleStyle('top-right')} onMouseDown={(e) => startResize(e, 'top-right')} />
          <div style={resizeHandleStyle('bottom-right')} onMouseDown={(e) => startResize(e, 'bottom-right')} />
          <div style={resizeHandleStyle('bottom-left')} onMouseDown={(e) => startResize(e, 'bottom-left')} />
        </>
      )}
    </div>
  );
}

const resizeHandleStyle = (pos: string) => ({
  position: "absolute" as const,
  width: "8px",
  height: "8px",
  background: "#1d4ed8",
  border: "1px solid white",
  borderRadius: "50%",
  cursor: `${pos}-resize`,
  ...(pos.includes('top') ? { top: "-4px" } : { bottom: "-4px" }),
  ...(pos.includes('left') ? { left: "-4px" } : { right: "-4px" })
});