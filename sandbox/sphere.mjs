export class Sphere {
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
  }

  render(p) {
    p.push();
    p.emissiveMaterial(240);
    p.strokeWeight(0);
    p.translate(this.center);
    p.sphere(this.radius);
    p.pop();
  }

  normalAt(point) {
    return point.copy().sub(this.center).normalize();
  }
}
