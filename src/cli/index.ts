#! /usr/bin/env node

import {renderTemplate} from '../renderer';
import {Command} from 'commander';

const program = new Command();

program
  .name('cf-render')
  .description('CLI to render AWS CloudFormation templates')
  .version('0.1.0')
  .requiredOption(
    '-i, --input <template-path>',
    'Path to the cloudFormation template to render'
  )
  .requiredOption(
    '-o, --output <image-path>',
    'Path to the output image. Must end with .png'
  )
  .addHelpText(
    'after',
    '\nExamples:' +
      '\n  $ cf-render --input template.json --output template.png' +
      '\n  $ cf-render -i template.yaml -o template.png'
  );

program.parse();

const options = program.opts();

if (!options.output.endsWith('.png')) {
  throw new Error('The output path must end with .png');
}

renderTemplate({
  inputPath: options.input,
  outputPath: options.output,
});
