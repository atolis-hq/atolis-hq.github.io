import { expect, test } from '@playwright/test';

test('renders the Corum particle skeleton and scroll sections', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Software design is fragmented/i })).toBeVisible();
  await expect(page.locator('[data-testid="particle-canvas"]')).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.82));
  await expect(page.getByText('See the system in action.')).toBeVisible();

  const demoOffset = await page.getByText('See the system in action.').evaluate((node) => {
    const section = node.closest('section');
    return section ? section.getBoundingClientRect().top + window.scrollY : 0;
  });
  const cicdOffset = await page.getByText('Validate design before it becomes code.').evaluate((node) => {
    const section = node.closest('section');
    return section ? section.getBoundingClientRect().top + window.scrollY : 0;
  });
  expect(demoOffset).toBeLessThan(cicdOffset);

  const canvasBox = await page.locator('[data-testid="particle-canvas"]').boundingBox();
  expect(canvasBox?.width).toBeGreaterThan(300);
  expect(canvasBox?.height).toBeGreaterThan(300);

  await page.waitForTimeout(250);
  const hasRenderedPixels = await page.locator('[data-testid="particle-canvas"]').evaluate((canvas) => {
    const source = canvas as HTMLCanvasElement;
    const sample = document.createElement('canvas');
    sample.width = 24;
    sample.height = 24;
    const context = sample.getContext('2d');
    if (!context) {
      return false;
    }

    context.drawImage(source, 0, 0, source.width, source.height, 0, 0, sample.width, sample.height);
    const pixels = context.getImageData(0, 0, sample.width, sample.height).data;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index] !== 0 || pixels[index + 1] !== 0 || pixels[index + 2] !== 0) {
        return true;
      }
    }

    return false;
  });

  expect(hasRenderedPixels).toBe(true);
});
