// src/components/Toolbar.tsx
import '../StyleComponents/Toolbar.css';

type ToolbarProps = {
  fontSize: number;
  setFontSize: (value: number) => void;
  elementWidth: number;
  setElementWidth: (value: number) => void;
  elementHeight: number;
  setElementHeight: (value: number) => void;

  onAddSlide: () => void;
  onRemoveSlide: () => void;

  onAddText: () => void;
  onAddImage: () => void;
  onRemoveObject: () => void;

  onChangeBackground: (color: string) => void;
};

export default function Toolbar({
  fontSize,
  setFontSize,
  elementWidth,
  setElementWidth,
  elementHeight,
  setElementHeight,
  onAddSlide,
  onRemoveSlide,
  onAddText,
  onAddImage,
  onRemoveObject,
  onChangeBackground
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button onClick={onAddSlide} className="btn btn--slide">
          <span>➕</span> Слайд
        </button>
        <button onClick={onRemoveSlide} className="btn btn--slide-del">
          <span>🗑️</span> Слайд
        </button>
      </div>

      <div className="toolbar-group">
        <button onClick={onAddText} className="btn btn--text">
          <span>🔤</span> Текст
        </button>
        <button onClick={onAddImage} className="btn btn--image">
          <span>🖼️</span> Картинка
        </button>
        <button onClick={onRemoveObject} className="btn btn--obj-del">
          <span>➖</span> Объект
        </button>
      </div>

      <div className="toolbar-group" style={{ alignItems: 'center' }}>
        <label className="toolbar-label">Фон:</label>
        <input
          type="color"
          defaultValue="#ffffff"
          onChange={(e) => onChangeBackground(e.target.value)}
          className="toolbar-color-picker"
        />
      </div>

      <div className="toolbar-group" style={{ alignItems: 'center' }}>
        <label className="toolbar-label">Текст:</label>
        <input
          type="number"
          value={fontSize}
          min={8}
          max={60}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="toolbar-input"
        />

        <label className="toolbar-label">W:</label>
        <input
          type="number"
          value={elementWidth}
          min={10}
          onChange={(e) => setElementWidth(Number(e.target.value))}
          className="toolbar-input"
        />

        <label className="toolbar-label">H:</label>
        <input
          type="number"
          value={elementHeight}
          min={10}
          onChange={(e) => setElementHeight(Number(e.target.value))}
          className="toolbar-input"
        />
      </div>
    </div>
  );
}