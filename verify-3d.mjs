import { chromium } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];

const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
  });

  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);

  const metrics = await page.evaluate(() => {
    const canvas = document.querySelector('.scene canvas');
    const rect = canvas.getBoundingClientRect();
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    let nonBlank = 0;
    let colorVariance = 0;

    for (let index = 0; index < pixels.length; index += 16) {
      const red = pixels[index];
      const green = pixels[index + 1];
      const blue = pixels[index + 2];
      const alpha = pixels[index + 3];

      if (alpha > 0 && red + green + blue > 8) {
        nonBlank += 1;
      }

      colorVariance += Math.abs(red - green) + Math.abs(green - blue);
    }

    return {
      title: document.querySelector('h1')?.textContent,
      canvasRect: {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        left: Math.round(rect.left),
      },
      buffer: { width, height },
      nonBlank,
      colorVariance,
    };
  });

  if (metrics.nonBlank < 1000 || metrics.colorVariance < 1000) {
    throw new Error(`${viewport.name} canvas appears blank: ${JSON.stringify(metrics)}`);
  }

  await page.screenshot({ path: `verification-${viewport.name}.png`, fullPage: true });
  console.log(`${viewport.name}: ${JSON.stringify(metrics)}`);
  await page.close();
}

await browser.close();
