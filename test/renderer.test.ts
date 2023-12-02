import {renderTemplate} from '../src/renderer';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {toMatchImageSnapshot} from 'jest-image-snapshot';

expect.extend({toMatchImageSnapshot});

describe('Renderer', () => {
  const inputPathJson = path.resolve(__dirname, './fixtures', 'template.json');
  const inputPathYaml = path.resolve(__dirname, './fixtures', 'template.yaml');
  const imagePath = path.resolve(__dirname, './../.out', 'template.png');

  // Regression
  it('should produce the same output image for a given json template', async () => {
    await renderTemplate({
      inputPath: inputPathJson,
      outputPath: imagePath,
    });

    const image = fs.readFileSync(imagePath);
    expect(image).toMatchImageSnapshot();
  });
  it('should produce the same output image for a given yaml template', async () => {
    await renderTemplate({
      inputPath: inputPathYaml,
      outputPath: imagePath,
    });

    const image = fs.readFileSync(imagePath);
    expect(image).toMatchImageSnapshot();
  });
});
