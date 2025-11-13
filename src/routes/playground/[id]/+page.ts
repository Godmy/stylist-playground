import { error } from '@sveltejs/kit';
import { getStoryById } from '../../../lib/utils/stories';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const story = await getStoryById(params.id);

  if (!story) {
    throw error(404, 'Story not found');
  }

  return {
    story
  };
};
