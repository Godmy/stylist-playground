import { error } from '@sveltejs/kit';
import { getStoryById } from '../../../lib/utils/stories';
import type { PageLoad } from './$types';

// Disable SSR because story components use dynamic imports (import.meta.glob)
// which don't work during server-side rendering
export const ssr = false;

export const load: PageLoad = async ({ params }) => {
  const story = await getStoryById(params.id);

  if (!story) {
    throw error(404, 'Story not found');
  }

  return {
    story
  };
};
