import { bezier, Point } from "./bezier";

export const POINT_RADIUS = 15;

export class Drawing {
  private points: Point[] = [];
  private selectedPoint: number | null = null;

  constructor(
    readonly ctx: CanvasRenderingContext2D,
    readonly canvas: HTMLCanvasElement
  ) {}

  private drawBezier(points: readonly Point[]) {
    const dt = 0.001;

    for (let t = 0; t <= 1; t += dt) {
      this.drawPoint(bezier(points, t), 1, "#eee");
    }
  }

  private drawPoints() {
    for (const [i, p] of this.points.entries()) {
      const color = this.selectedPoint === i ? "#c75804" : "white";
      this.drawPoint(p, POINT_RADIUS, color);

      const textColor = this.selectedPoint === i ? "white" : "#c75804";
      this.drawText(p, (i + 1).toString(), textColor);
    }
  }

  redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.points.length > 1) this.drawBezier(this.points);
    this.drawPoints();
  }

  private drawPoint(point: Point, radius: number, color: string) {
    this.ctx.beginPath();
    this.ctx.arc(...point, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  private drawText(point: Point, text: string, color: string) {
    this.ctx.beginPath();
    this.ctx.font = "11pt Avenir";
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, point[0], point[1] + 5);
  }

  getTouchedPointIndex(position: Point) {
    for (const [i, point] of this.points.entries()) {
      const distance = Math.sqrt(
        (position[0] - point[0]) ** 2 + (position[1] - point[1]) ** 2
      );

      if (distance <= POINT_RADIUS) {
        return i;
      }
    }
    return null;
  }

  addPoint(point: Point) {
    this.points.push(point);
    this.redraw();
  }

  updatePointAt(index: number, point: Point) {
    this.points[index] = point;
    this.redraw();
  }

  deleteAt(index: number) {
    this.points = this.points.filter((_, i) => i !== index);

    if (index === this.selectedPoint) {
      this.selectedPoint = null;
    }

    this.redraw();
  }

  setSelectedPoint(index: number | null) {
    this.selectedPoint = index;
    this.redraw();
  }

  getSelectedPoint(): number | null {
    return this.selectedPoint;
  }

  get pointsCount() {
    return this.points.length;
  }
}
