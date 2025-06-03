export const axes = (p) => {
  p.push();
  p.strokeWeight(3);

  p.push();
  p.stroke(255, 0, 0);
  p.line(0, 0, 0, 1, 0, 0);
  p.pop();

  p.push();
  p.stroke(0, 255, 0);
  p.line(0, 0, 0, 0, 1, 0);
  p.pop();

  p.push();
  p.stroke(0, 0, 255);
  p.line(0, 0, 0, 0, 0, 1);
  p.pop();
  p.pop();
};
