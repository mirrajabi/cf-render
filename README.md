# CloudFormation Template Renderer

![npm](https://img.shields.io/npm/v/cf-render)

This is a simple tool that leverages AWS Application Composer's renderer to render CloudFormation templates. Since **CDK** also generates CloudFormation templates, this tool can be used to render the stacks created by CDK projects as well.

**Beta notice**: This tool is currently in beta. Please report any issues you encounter. also read the [Good to know](#good-to-know) section.

## Example output

Below image is the output of [this template](https://github.com/mirrajabi/cf-render/blob/main/test/fixtures/template.yaml).
![Example output](https://github.com/mirrajabi/cf-render/blob/main/assets/example.png)

## Installation

First you need to install [Playwright](https://playwright.dev/). This tool uses Playwright to render the templates. You can install it using `npm`:

```bash
# For now this library only supports rendering using Chromium
npx --yes playwright install chromium
```

Then you can install `cf-renderer` using npm either globally or locally. If you install it globally, you can use it as a CLI tool. If you install it locally, you can use it as a library.

```bash
# To use it as a CLI tool
npm install -g cf-render

# To use it as a library
npm install cf-render
```

## Usage - CLI

```bash
Usage: cf-render [options]

CLI to render AWS CloudFormation templates

Options:
  -V, --version                output the version number
  -i, --input <template-path>  Path to the cloudFormation template to render
  -o, --output <image-path>    Path to the output image. Must end with .png
  -h, --help                   display help for command

Examples:
  $ cf-render --input template.json --output template.png
  $ cf-render -i template.yaml -o template.png
```

## Usage - Library

```typescript
import { renderTemplate } from 'cf-render';

...
  await renderTemplate({
    inputPath: './template.yaml', 
    outputPath: './template.png'
  });
...
```

## How to use it with CDK

CDK generates CloudFormation templates in the `cdk.out` directory when synthesizing the stacks. You can use this tool to render the generated templates. You can also ask CDK to just synthesize your stacks and not deploy them.

```bash
cdk synth
cf-render -i cdk.out/MyStack.template.json -o MyStack.png
```

## Roadmap

- [x] Put it out there!
- [ ] Add support for screen size configuration
- [ ] Trim the output image. Currently the canvas area is too large.

## Good to know

- This tool uses the publicly available [AWS Application Composer instance](https://ide-toolkits.app-composer.aws.dev/index.html) to render the templates. I'm not aware of any legal issues with using this public instance. If you represent AWS and you have any issues with this tool, please let me know but just don't tell Jeff.
- Changes to the Application Composer's web UI might affect this library's functionality. If you encounter any issues, please report them. **If your life depends on generating diagrams from CloudFormation templates, you might want to consider using a different tool.** Otherwise, you can help improving this tool.
- You need to have an internet connection to use this tool.
