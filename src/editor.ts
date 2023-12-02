// The function in this file is copied from https://github.com/deephaven/web-client-ui/blob/9d905fca86aa8ba4ff53debd1fd12dcc9132299b/tests/utils.ts#L107
import {Page} from 'playwright';
import * as os from 'node:os';

/**
 * Pastes text into a monaco input. The input will have focus after pasting.
 * @param locator Locator to use for monaco editor
 * @param text Text to be pasted
 */
export const pasteInMonacoEditor = async (page: Page, text: string) => {
  const editor = page.locator('.monaco-editor').first()!;

  const isMac = os.platform() === 'darwin';
  const modifier = isMac ? 'Meta' : 'Control';

  // Create a hidden textarea with the contents to paste
  const inputId = await page.evaluate(async evalText => {
    const tempInput = document.createElement('textarea');
    tempInput.id = 'super-secret-temp-input-id';
    tempInput.value = evalText;
    tempInput.style.width = '0';
    tempInput.style.height = '0';
    document.body.appendChild(tempInput);
    tempInput.select();
    return tempInput.id;
  }, text);

  // Copy the contents of the textarea which was selected above
  await page.keyboard.press(`${modifier}+C`);

  // Remove the textarea
  await page.evaluate(id => {
    document.getElementById(id)?.remove();
  }, inputId);

  // Focus monaco
  await editor.focus();

  const browserName = page.context().browser()?.browserType().name();
  if (browserName !== 'firefox') {
    // Chromium on mac and webkit on any OS don't seem to paste w/ the keyboard shortcut
    await page.locator('textarea').evaluate(async (element, evalText) => {
      const clipboardData = new DataTransfer();
      clipboardData.setData('text/plain', evalText);
      const clipboardEvent = new ClipboardEvent('paste', {
        clipboardData,
      });
      element.dispatchEvent(clipboardEvent);
    }, text);
  } else {
    await page.keyboard.press(`${modifier}+V`);
  }
};
