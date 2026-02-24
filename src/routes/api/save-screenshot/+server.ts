import { json } from '@sveltejs/kit';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import type { RequestHandler } from './$types';

function createSafeFilename(originalName: string): string {
  const rawExt = extname(originalName).toLowerCase();
  const ext = ['.png', '.jpg', '.jpeg', '.webp'].includes(rawExt) ? rawExt : '.png';
  return `screenshot-${Date.now()}-${randomUUID()}${ext}`;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const screenshot = formData.get('screenshot') as File;

    if (!screenshot) {
      return json({ error: 'No screenshot provided' }, { status: 400 });
    }

    const filename = createSafeFilename(screenshot.name);

    // Save to static/screenshots folder
    const screenshotsDir = join(process.cwd(), 'static', 'screenshots');
    const filepath = join(screenshotsDir, filename);

    // Convert File to Buffer
    const buffer = Buffer.from(await screenshot.arrayBuffer());

    await mkdir(screenshotsDir, { recursive: true });
    await writeFile(filepath, buffer);

    return json({
      success: true,
      path: `/screenshots/${filename}`,
      fullPath: filepath
    });
  } catch (error) {
    console.error('Failed to save screenshot:', error);
    return json(
      { error: 'Failed to save screenshot', details: String(error) },
      { status: 500 }
    );
  }
};
