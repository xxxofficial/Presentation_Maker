// src/App.tsx
import type { JSX } from "react";
import { useState, useEffect } from "react";
import { maxPresentation } from "./testApp1";
import type { Presentation, Slide } from "./types/api";
import { setEditorModel, getEditorModel, addEditorChangeHandler, dispatch } from "./editor";
import { addSlide, removeSlide, addObject, removeObject, renamePresentation, resizeObject, changeSlideBackground } from "./types/api";
import "./App.css";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import SlideList from "./components/SlideList";
import Workplace from "./components/Workplace";

export default function App(): JSX.Element {
  const [presentation, setPresentation] = useState<Presentation>(() => {
    const model = structuredClone(maxPresentation);
    setEditorModel(model);
    return model;
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const currentSlide: Slide = presentation.slides[currentSlideIndex];
  const firstTextObject = currentSlide.objects.find(o => o.type === "text");
  const fontSize = firstTextObject ? firstTextObject.fontSize : 16;
  const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);

  useEffect(() => {
    const handler = () => {
      setPresentation(getEditorModel());
    };
    addEditorChangeHandler(handler);
  }, []);

  const handleAddSlide = () => {
    const newSlideNumber = presentation.slides.length + 1;
    dispatch(addSlide, {
      id: crypto.randomUUID(),
      background: "#ffffff",
      objects: [],
      name: `Слайд ${newSlideNumber}`
    });
  };

  const toggleSelectObject = (objectId: string, isShift: boolean) => {
    if (isShift) {
      setSelectedObjectIds(prev =>
        prev.includes(objectId)
          ? prev.filter(id => id !== objectId)
          : [...prev, objectId]
      );
    } else {
      setSelectedObjectIds([objectId]);
    }
  };

  const handleChangeBackground = (color: string) => {
    dispatch(changeSlideBackground, {
      slideId: currentSlide.id,
      background: color
    });
  };

  const handleRemoveSlide = () => {
    if (presentation.slides.length <= 1) {
      alert("Нельзя удалить последний слайд");
      return;
    }
    dispatch(removeSlide, currentSlide.id);
    if (currentSlideIndex >= presentation.slides.length - 1) {
      setCurrentSlideIndex(presentation.slides.length - 2);
    }
  };

  const handleChangeTitle = (newTitle: string) => {
    dispatch(renamePresentation, newTitle);
  };

  const handleFontSizeChange = (newSize: number) => {
    if (currentSlide.objects.length === 0) {
      alert("Нет объектов для изменения размера");
      return;
    }
    const firstTextObject = currentSlide.objects.find(obj => obj.type === "text");
    if (!firstTextObject) {
      alert("Нет текстовых объектов");
      return;
    }

    const clampedSize = Math.max(8, Math.min(60, newSize));
    dispatch(resizeObject, {
      slideId: currentSlide.id,
      objectId: firstTextObject.id,
      newSize: Math.max(8, Math.min(60, newSize))
    });
  };

  const handleAddText = () => {
    dispatch(addObject, {
      slideId: currentSlide.id,
      obj: {
        id: crypto.randomUUID(),
        type: "text",
        content: "Новый текст",
        fontSize: 18,
        color: "#000000",
        fontFamily: "Arial",
        position: { x: 50, y: 50 }
      }
    });
  };

  const handleAddImage = () => {
    dispatch(addObject, {
      slideId: currentSlide.id,
      obj: {
        id: crypto.randomUUID(),
        type: "image",
        size: { width: 150, height: 100 },
        position: { x: 100, y: 100 },
        src: "https://picsum.photos/150/100" 
      }
    });
  };

  const handleRemoveObject = () => {
    if (currentSlide.objects.length === 0) {
      alert("Нет объектов для удаления");
      return;
    }
    const firstObjectId = currentSlide.objects[0].id;
    dispatch(removeObject, {
      slideId: currentSlide.id,
      objectId: firstObjectId
    });
  };

  return (
    <div className="app">
      <Header
        presentationTitle={presentation.title}
        setPresentationTitle={handleChangeTitle}
      />
      <Toolbar
        fontSize={fontSize}
        setFontSize={handleFontSizeChange}
        elementWidth={100}
        setElementWidth={() => {}}
        elementHeight={100}
        setElementHeight={() => {}}
        onAddSlide={handleAddSlide}
        onRemoveSlide={handleRemoveSlide}
        onAddText={handleAddText}
        onAddImage={handleAddImage}
        onRemoveObject={handleRemoveObject}
        onChangeBackground={handleChangeBackground}
      />
      <div className="main">
        <SlideList slides={presentation.slides} setCurrentSlideIndex={setCurrentSlideIndex} />
        <Workplace currentSlide={currentSlide} 
          selectedObjectIds={selectedObjectIds}
          toggleSelectObject={toggleSelectObject}
          />
      </div>
    </div>
  );
}