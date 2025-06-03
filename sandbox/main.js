import { axes } from "./axes.mjs";
import { raySphereIntersection } from "./ray-sphere-intersection.mjs";
import { Sphere } from "./sphere.mjs";

// Environment
const WIDTH = 12;
const HEIGHT = 8;
const SCALE = 100;

// Camera
const FOV = 40;

// Material
const AMBIENT = 0.2;
const DIFFUSE = 0.4;
const SPECULAR = 0.9;
const SHININESS = 60;

const sketch = (p) => {
  const origin = p.createVector(0, 0, 0);
  const lightPosition = p.createVector(3, 4, -3);

  const sphere1 = new Sphere(p.createVector(0, 0, -8), 2);

  const showLightDirectionsCheckbox = p.createCheckbox("Show light directions");
  const showViewerDirectionsCheckbox = p.createCheckbox(
    "Show viewer directions"
  );
  const showNormalsCheckbox = p.createCheckbox("Show normals");
  const showHalfwayVectorsCheckbox = p.createCheckbox("Show halfway vectors");
  const showRaysCheckbox = p.createCheckbox("Show rays");

  const pixelsWideSliderContainer = p.createDiv();
  const pixelsWideSliderLabel = p.createSpan("Pixels wide");
  const pixelsWideSlider = p.createSlider(5, 30, 15);
  pixelsWideSliderContainer.elt.appendChild(pixelsWideSliderLabel.elt);
  pixelsWideSliderContainer.elt.appendChild(pixelsWideSlider.elt);

  const imagePlaneZSliderContainer = p.createDiv();
  const imagePlaneZSliderLabel = p.createSpan("Image plane z");
  const imagePlaneZSlider = p.createSlider(0, 6, 4, 0.1);
  imagePlaneZSliderContainer.elt.appendChild(imagePlaneZSliderLabel.elt);
  imagePlaneZSliderContainer.elt.appendChild(imagePlaneZSlider.elt);

  p.setup = () => {
    p.createCanvas(SCALE * WIDTH, SCALE * HEIGHT, p.WEBGL);
  };

  p.draw = () => {
    const pixelsWide = pixelsWideSlider.value();
    const imageSize =
      2 * imagePlaneZSlider.value() * Math.tan((FOV * Math.PI) / 360);
    const pixelSize = imageSize / pixelsWide;

    p.orbitControl();
    p.scale(SCALE, -SCALE, SCALE);
    p.rotate(p.PI / 3, p.createVector(0, 1, 0));

    p.background(255);

    axes(p);
    p.push();
    p.strokeWeight(1);
    p.stroke(0, 255, 255);
    p.line(
      ...origin.array(),
      imageSize / 2,
      imageSize / 2,
      -imagePlaneZSlider.value()
    );
    p.line(
      ...origin.array(),
      imageSize / 2,
      -imageSize / 2,
      -imagePlaneZSlider.value()
    );
    p.line(
      ...origin.array(),
      -imageSize / 2,
      imageSize / 2,
      -imagePlaneZSlider.value()
    );
    p.line(
      ...origin.array(),
      -imageSize / 2,
      -imageSize / 2,
      -imagePlaneZSlider.value()
    );
    p.pop();

    sphere1.render(p);

    p.push();
    p.stroke(255, 200, 100);
    p.strokeWeight(20);
    p.point(lightPosition);
    p.pop();

    for (let i = 0; i < pixelsWide; i++) {
      for (let j = 0; j < pixelsWide; j++) {
        const pixelCenter = p.createVector(
          (j - pixelsWide / 2 + 1 / 2) * pixelSize,
          -(i - pixelsWide / 2 + 1 / 2) * pixelSize,
          -imagePlaneZSlider.value()
        );
        const rayDirection = pixelCenter.copy().normalize();
        const intersectionDistance = raySphereIntersection(
          origin,
          rayDirection,
          sphere1.center,
          sphere1.radius
        );

        let color = 0;
        if (intersectionDistance >= 0) {
          const intersection = origin
            .copy()
            .add(rayDirection.copy().mult(intersectionDistance));
          const lightDirection = lightPosition
            .copy()
            .sub(intersection)
            .normalize();
          const viewerDirection = rayDirection.copy().mult(-1);
          const halfwayVector = lightDirection
            .copy()
            .add(viewerDirection)
            .normalize();
          const normal = sphere1.normalAt(intersection);

          color =
            AMBIENT +
            SPECULAR * p.pow(halfwayVector.dot(normal), SHININESS) +
            DIFFUSE * lightDirection.dot(normal);

          if (showLightDirectionsCheckbox.checked()) {
            p.push();
            p.stroke(255, 200, 100);
            p.strokeWeight(3);
            p.line(
              ...intersection.array(),
              ...intersection.copy().add(lightDirection).array()
            );
            p.pop();
          }

          if (showViewerDirectionsCheckbox.checked()) {
            p.push();
            p.stroke(150, 255, 150);
            p.strokeWeight(3);
            p.line(
              ...intersection.array(),
              ...intersection.copy().add(viewerDirection).array()
            );
            p.pop();
          }

          if (showHalfwayVectorsCheckbox.checked()) {
            p.push();
            p.stroke(255, 100, 200);
            p.strokeWeight(3);
            p.line(
              ...intersection.array(),
              ...intersection.copy().add(halfwayVector).array()
            );
            p.pop();
          }

          if (showNormalsCheckbox.checked()) {
            p.push();
            p.stroke(100, 150, 255);
            p.strokeWeight(3);
            p.line(
              ...intersection.array(),
              ...intersection.copy().add(normal).array()
            );
            p.pop();
          }

          if (showRaysCheckbox.checked()) {
            p.push();
            p.stroke(color * 255);
            p.strokeWeight(3);
            p.line(0, 0, 0, ...intersection.array());
            p.pop();
          }
        }

        // Pixels
        p.push();
        p.translate(pixelCenter);
        p.emissiveMaterial(color * 255);
        p.noStroke();
        p.plane(pixelSize);
        p.pop();
      }
    }
  };
};

new p5(sketch);
