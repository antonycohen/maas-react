import { EditorPlugin } from "../../../types";
import { PodcastCarouselBlock } from "../blocks/podcast-carousel-block";
import {
  CMSPodcastCarouselBlock,
  podcastCarouselShape,
} from '@maas/core-api-models';

export const PodcastCarouselPlugin: EditorPlugin<
  "PodcastCarousel",
  CMSPodcastCarouselBlock,
  any
> = {
  name: "PodcastCarousel",
  displayName: "Podcasts",
  enabled: true,
  icon: "Audio",
  blockType: "podcast-carousel",
  shape: podcastCarouselShape,
  inputsSections: [
    {
      name: "Data",
      hasBorder: false,
      inputs: [
        {
          type: "multi_group",
          name: "podcasts",
          label: "Text",
          subtitle: "Podcast",
          required: true,
          items: [
            {
              type: "text",
              name: "url",
              label: "Url",
              required: true,
            },
          ],
        },
      ],
    },
  ],
  renderingBlock: (props) => {
    return PodcastCarouselBlock({ block: props });
  },
};
