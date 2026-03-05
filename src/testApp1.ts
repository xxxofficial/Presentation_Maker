import type { Presentation } from "./types/api";

export const maxPresentation: Presentation = {
  id: "p2",
  title: "Моя презентация",
  slides: [
    {
      id: "s1",
      background: "gray",
      objects: [
        {
          id: "t1",
          type: "text",
          content: "пр",
          color: "#f5f5f5",
          fontSize: 25,
          fontFamily: "Arial",
          position: { x: 500, y: 400 }
        },
        {
          id: "i1",
          type: "image",
          size: { width: 400, height: 100 },
          position: { x: 500, y: 300 },
          src: "https://via.placeholder.com/400x100" 
        }
      ]
    },
    {
      id: "s2",
      background: "#8B78A5",
      objects: [
        {
          id: "t2",
          type: "text",
          content: "А ты че не на фроте?",
          color: "#FFF5E6",
          fontSize: 14,
          fontFamily: "Arial",
          position: { x: 100, y: 50 }
        },
        {
          id: "i2",
          type: "image",
          size: { width: 140, height: 300 },
          position: { x: 14, y: 88 },
          src: "https://via.placeholder.com/140x300" 
        }
      ]
    }
  ]
};