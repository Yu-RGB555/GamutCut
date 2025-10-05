import { ShapeTemplate } from "@/types/gamut";
import { createCirclePoints } from "./maskUtils";

export const shapeTemplates: ShapeTemplate[] = [
    {
      id: 1,
      shape_type: "triangle",
      points: [
        { x: 0.5, y: 0.2 },
        { x: 0.7, y: 0.8 },
        { x: 0.3, y: 0.8 }
      ]
    },
    {
      id: 2,
      shape_type: "square",
      points: [
        { x: 0.3, y: 0.3 },
        { x: 0.7, y: 0.3 },
        { x: 0.7, y: 0.7 },
        { x: 0.3, y: 0.7 }
      ]
    },
    {
      id: 3,
      shape_type: "circle",
      points: createCirclePoints(0.5, 0.5, 0.2, 36)
    }
  ];