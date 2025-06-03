export const raySphereIntersection = (origin, direction, center, radius) => {
  // Assume d is normalized

  // Could still be zero
  if (direction.mag() === 0) {
    return -1;
  }

  // At this point, a must be 1

  const u = origin.copy().sub(center);

  const b = u.dot(direction);
  const c = u.dot(u) - radius * radius;

  const discriminant = b * b - c;

  // Miss
  if (discriminant < 0) {
    return -1;
  }

  // Graze
  if (discriminant === 0) {
    return -b;
  }

  // Hit
  return -b - Math.sqrt(discriminant);
};
