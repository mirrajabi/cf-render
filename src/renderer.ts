import {chromium} from 'playwright';
import {readTemplate} from './reader';
import {pasteInMonacoEditor} from './editor';

const APPLICATION_COMPOSER_URL =
  'https://ide-toolkits.app-composer.aws.dev/index.html';

export interface RenderOptions {
  /**
   * Path to the CloudFormation template to render.
   */
  inputPath: string;
  /**
   * Path to where the output image should be placed. Must end with .png.
   */
  outputPath: string;
}

/**
 * Renders the template by performing a series of actions in a headless browser.
 *
 * @param options - The options for rendering the template.
 * @returns A Promise that resolves when the rendering is complete.
 */
export const renderTemplate = async (options: RenderOptions) => {
  const template = await readTemplate(options.inputPath);

  // Setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the application composer
  await page.goto(APPLICATION_COMPOSER_URL);

  // Expect a download to be started when the "Export canvas" button is clicked
  const downloadPromise = page.waitForEvent('download');

  // Wait a bit so that the button becomes clickable
  await page.waitForTimeout(500);
  // Click on the "Template" button
  await page.click('button:has(span:has-text("Template"))');
  // Paste the template in the editor (using fill() doesn't work because monaco is not an input field)
  await pasteInMonacoEditor(page, template);
  // Wait for the editor to finish rendering
  await page.waitForTimeout(500);
  // Click on the "Canvas" button
  await page.click('button:has(span:has-text("Canvas"))');
  // Click on the "Arrange" button
  await page.click('button:has(span:has-text("Arrange"))');
  // Click on the "Zoom to fit layout" button to center the template.
  // This also makes the renders deterministic.
  await page.click('button[title="Zoom to fit layout"]');
  // Click on the "Menu" button to expand it
  await page.click("[id='awsui-button-dropdown__trigger:r1:']");
  // Click on the "Export canvas" button
  await page.click('span:has-text("Export canvas")');
  // Catch the downloaded file
  const download = await downloadPromise;
  await download.saveAs(options.outputPath);

  // Teardown
  await context.close();
  await browser.close();
};
