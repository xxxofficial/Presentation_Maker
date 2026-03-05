// src/editor.ts
import type { Presentation } from "./types/api"; // ← ./types/api

let editorModel: Presentation;
let editorChangeHandler: (() => void) | null = null;

export function setEditorModel(model: Presentation) {
  editorModel = structuredClone(model);
}

export function getEditorModel(): Presentation {
  return structuredClone(editorModel);
}

export function addEditorChangeHandler(handler: () => void) {
  editorChangeHandler = handler;
}

export function dispatch<T extends any[]>(
  modifier: (model: Presentation, ...args: T) => Presentation,
  ...params: T
) {
  const newModel = modifier(editorModel, ...params);
  editorModel = newModel;

  if (editorChangeHandler) {
    editorChangeHandler();
  }
}