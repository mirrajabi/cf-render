import {renderTemplate} from '../src/renderer';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {toMatchImageSnapshot} from 'jest-image-snapshot';

expect.extend({toMatchImageSnapshot});

describe('Renderer', () => {
  const inputPath = path.resolve(__dirname, './fixtures', 'template.json');
  const imagePath = path.resolve(__dirname, './.out', 'template.png');

  // Regression
  it('should produce the same output image', async () => {
    await renderTemplate({
      inputPath: inputPath,
      outputPath: imagePath,
    });

    const image = fs.readFileSync(imagePath);
    expect(image).toMatchImageSnapshot();
  });
});
