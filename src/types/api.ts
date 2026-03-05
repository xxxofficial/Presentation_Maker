// src/types/api.ts

export type Position = {
  x: number;
  y: number;
};

export type ImageSize = {
  width: number;
  height: number;
};

export type TextObject = {
  id: string;
  type: "text";
  content: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  position: Position;
};

export type ImageObject = {
  id: string;
  type: "image";
  size: ImageSize;
  position: Position;
  src: string; 
};

export type SlideObject = TextObject | ImageObject;

export type Slide = {
  id: string;
  background: string;
  objects: SlideObject[];
  name?: string;
};

export type Presentation = {
  id: string;
  title: string;
  slides: Slide[];
};

export type ResizeCorner = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';

export function addSlide(p: Presentation, slide: Slide): Presentation {
  return { ...p, slides: [...p.slides, slide] };
}

export function removeSlide(p: Presentation, slideId: string): Presentation {
  return { ...p, slides: p.slides.filter(s => s.id !== slideId) };
}

export function addObject(p: Presentation, params: { slideId: string; obj: SlideObject }): Presentation {
  return {
    ...p,
    slides: p.slides.map(slide =>
      slide.id === params.slideId
        ? { ...slide, objects: [...slide.objects, params.obj] }
        : slide
    )
  };
}

export function removeObject(p: Presentation, params: { slideId: string; objectId: string }): Presentation {
  return {
    ...p,
    slides: p.slides.map(slide =>
      slide.id === params.slideId
        ? { ...slide, objects: slide.objects.filter(o => o.id !== params.objectId) }
        : slide
    )
  };
}

export function renamePresentation(p: Presentation, newTitle: string): Presentation {
  return { ...p, title: newTitle };
}

// ✅ resizeObject — теперь принимает объект (требование лекции)
export function resizeObject(
  p: Presentation,
  params: {
    slideId: string;
    objectId: string;
    newSize?: number;        // для текста (старый resize)
    corner?: ResizeCorner;   // для изображений (новый resize)
    deltaX?: number;
    deltaY?: number;
  }
): Presentation {
  const { slideId, objectId, newSize, corner, deltaX = 0, deltaY = 0 } = params;

  return {
    ...p,
    slides: p.slides.map(slide =>
      slide.id === slideId
        ? {
            ...slide,
            objects: slide.objects.map(obj => {
              if (obj.id !== objectId) return obj;

              // Старый режим: изменение fontSize текста
              if (newSize !== undefined && obj.type === "text") {
                return { ...obj, fontSize: newSize };
              }

              // Новый режим: ресайз изображения по углам
              if (obj.type === "image" && corner) {
                const newWidth = Math.max(20,
                  corner.includes('left') ? obj.size.width - deltaX : obj.size.width + deltaX
                );
                const newHeight = Math.max(20,
                  corner.includes('top') ? obj.size.height - deltaY : obj.size.height + deltaY
                );

                let x = obj.position.x;
                let y = obj.position.y;

                if (corner === 'top-left' || corner === 'bottom-left') {
                  x += obj.size.width - newWidth;
                }
                if (corner === 'top-left' || corner === 'top-right') {
                  y += obj.size.height - newHeight;
                }

                return {
                  ...obj,
                  size: { width: newWidth, height: newHeight },
                  position: { x, y }
                };
              }

              return obj;
            })
          }
        : slide
    )
  };
}

export function changeSlideBackground(p: Presentation, params: { slideId: string; background: string }): Presentation {
  return {
    ...p,
    slides: p.slides.map(slide =>
      slide.id === params.slideId ? { ...slide, background: params.background } : slide
    )
  };
}

export function moveObject(
  p: Presentation,
  params: { slideId: string; objectId: string; x: number; y: number }
): Presentation {
  return {
    ...p,
    slides: p.slides.map(slide =>
      slide.id === params.slideId
        ? {
            ...slide,
            objects: slide.objects.map(obj =>
              obj.id === params.objectId
                ? { ...obj, position: { x: params.x, y: params.y } }
                : obj
            )
          }
        : slide
    )
  };
}

export function moveSlide(
  p: Presentation,
  params: { fromIndex: number; toIndex: number }
): Presentation {
  const slides = [...p.slides];
  const [moved] = slides.splice(params.fromIndex, 1);
  slides.splice(params.toIndex, 0, moved);
  return { ...p, slides };
}