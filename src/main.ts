import { Point } from "./bazier";
import { Drawing } from "./Drawing";
import "./style.css";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const ctx = canvas.getContext("2d")!;
const drawing = new Drawing(ctx, canvas);

let holding = false;

window.onload = window.onresize = () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  drawing.redraw();
};

const DELETE_KEYS = ["Backspace", "Delete"];

window.onkeydown = (e) => {
  const selectedPoint = drawing.getSelectedPoint();

  if (DELETE_KEYS.includes(e.key) && selectedPoint !== null) {
    drawing.deleteAt(selectedPoint);
    drawing.setSelectedPoint(null);
  } else if (e.key === "Escape") {
    drawing.setSelectedPoint(null);
  } else if (e.key === "Tab") {
    const pointsCount = drawing.pointsCount;

    if (pointsCount === 0) return;

    e.preventDefault();
    if (selectedPoint === null) {
      drawing.setSelectedPoint(0);
    } else {
      drawing.setSelectedPoint((selectedPoint + 1) % pointsCount);
    }
  } else {
    console.log(e.key);
  }
};

canvas.addEventListener("mousemove", (e) => {
  const selectedPoint = drawing.getSelectedPoint();

  if (holding && selectedPoint !== null) {
    drawing.updatePointAt(selectedPoint, [e.x, e.y]);
  }
});

canvas.addEventListener("mouseup", () => {
  holding = false;
});

canvas.addEventListener("mousedown", (e) => {
  const position = [e.x, e.y] satisfies Point;
  const selectedPoint = drawing.getSelectedPoint();
  const pointIndex = drawing.getTouchedPointIndex(position);

  if (e.button !== 0 || (selectedPoint != null && pointIndex === null)) {
    drawing.setSelectedPoint(null);
    return;
  }

  if (pointIndex !== null) {
    drawing.setSelectedPoint(pointIndex);
  } else {
    drawing.setSelectedPoint(null);
    drawing.addPoint(position);
  }

  holding = true;
});
