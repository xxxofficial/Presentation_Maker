// src/components/Workplace.tsx
import Element from "./Element";
import type { Slide } from "../types/api";

type WorkplaceProps = {
  currentSlide: Slide;
  selectedObjectIds?: string[];
  toggleSelectObject?: (id: string, isShift: boolean) => void;
};

export default function Workplace({
  currentSlide,
  selectedObjectIds = [],
  toggleSelectObject
}: WorkplaceProps) {
  return (
    <div 
      className="workplace"
      style={{ 
        background: currentSlide.background,
        position: "relative",
        width: "100%",
        height: "100%"
      }}
    >
      {currentSlide.objects.map(obj => (
        <Element
          key={obj.id}
          obj={obj}
          slideId={currentSlide.id}
          isSelected={selectedObjectIds.includes(obj.id)}
          toggleSelectObject={toggleSelectObject}
        />
      ))}
    </div>
  );
}