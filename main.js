const sketch = (p) => {
  let angle = 0;

  p.setup = () => {
    p.createCanvas(400, 400);
  };

  p.draw = () => {
    angle += 0.05 % (2 * p.PI);

    p.background(255);

    p.translate(200, 200);
    p.scale(1, -1);

    p.push();
    p.rotate(angle);
    p.square(-50, -50, 100);
    p.pop();

    p.push();
    p.strokeWeight(5);
    p.point(0, 0);
    p.pop();
  };
};

new p5(sketch);
