import { json } from '@sveltejs/kit';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const screenshot = formData.get('screenshot') as File;

    if (!screenshot) {
      return json({ error: 'No screenshot provided' }, { status: 400 });
    }

    // Get the filename
    const filename = screenshot.name;

    // Save to static/screenshots folder
    const screenshotsDir = join(process.cwd(), 'static', 'screenshots');
    const filepath = join(screenshotsDir, filename);

    // Convert File to Buffer
    const buffer = Buffer.from(await screenshot.arrayBuffer());

    // Ensure directory exists
    try {
      await writeFile(filepath, buffer);
    } catch (err) {
      // If directory doesn't exist, create it and retry
      const { mkdir } = await import('fs/promises');
      await mkdir(screenshotsDir, { recursive: true });
      await writeFile(filepath, buffer);
    }

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
