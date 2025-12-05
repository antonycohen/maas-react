import {
  CMSAnalyzeBlock,
  CMSAutoBlock,
  CMSCardPressCoverageBlock,
  CMSCardsProfileBlock,
  CMSCardsQuotesBlock,
  CMSCardsTextBlock,
  CMSCardsTextWithImageAndChipBlock,
  CMSCardsTextWithImageBlock,
  CMSChronologyBlock,
  CMSClubLeaderList,
  CMSClubMediaCarouselBlock,
  CMSClubModalitiesCard,
  CMSClubOrganizationCard,
  CMSClubProjectsBlock,
  CMSClubTeamLeadersBlock,
  CMSClubTrackRecordBlock,
  CMSEventBlock,
  CMSFrequentlyAskedQuestion,
  CMSHeadingBlock,
  CMSHighlightBlock,
  CMSIAudioBlock,
  CMSIFrameBlock,
  CMSImageAndTextBlock,
  CMSImageBlock,
  CMSMosaicGalleryBlock,
  CMSParagraphBlock,
  CMSPodcastCarouselBlock,
  CMSVideoBlock,
} from "./models";

const headingBlockShape: CMSHeadingBlock = {
  id: "to_regenerate",
  type: "heading",
  data: {
    title: "Nouveau titre",
    level: 1,
    caption: "",
  },
};

const paragraphBlockShape: CMSParagraphBlock = {
  id: "to_regenerate",
  type: "paragraph",
  data: {
    text: "Nouveau texte",
  },
};

const clubTeamLeadersShape: CMSClubTeamLeadersBlock = {
  id: "to_regenerate",
  type: "club-team-leaders",
  data: null,
};

const clubTrackRecordsShape: CMSClubTrackRecordBlock = {
  id: "to_regenerate",
  type: "club-track-record",
  data: null,
};

const clubModalitiesCardShape: CMSClubModalitiesCard = {
  id: "to_regenerate",
  type: "club-modalities-card",
  data: null,
};

const clubLeadersListShape: CMSClubLeaderList = {
  id: "to_regenerate",
  type: "club-leader-list",
  data: null,
};

const clubMediaCarouselShape: CMSClubMediaCarouselBlock = {
  id: "to_regenerate",
  type: "club-medias-carousel",
  data: null,
};

const clubProjectsShape: CMSClubProjectsBlock = {
  id: "to_regenerate",
  type: "club-projects",
  data: null,
};

const clubOrganizationCardShape: CMSClubOrganizationCard = {
  id: "to_regenerate",
  type: "club-organization-card",
  data: null,
};

const cardEventShape: CMSEventBlock = {
  id: "to_regenerate",
  type: "card-event",
  data: {
    topChipLabel: "À venir",
    title: "Le titre de l'événement",
    description: "Une description de l'événement",
    subDescription: "Lorem ipsum",
    ctaLabel: "S'inscrire",
    ctaUrl: "https://tudigo.co",
    image: {
      id: null,
      url: "https://i.ibb.co/T0hppC2/Capture-d-e-cran-2024-07-17-a-11-34-09.png",
      base64: null,
      resizedImages: null,
      originalFilename: null,
    },
  },
};

const chronologyShape: CMSChronologyBlock = {
  id: "to_regenerate",
  type: "chronology",
  data: {
    chronology: [
      {
        title: "Nouveau titre",
        text: "Nouveau texte",
        date: "2021-01-01",
        image: {
          id: null,
          url: null,
          base64: null,
          resizedImages: null,
          originalFilename: null,
        },
      },
    ],
  },
};

const imageBlockShape: CMSImageBlock = {
  id: "to_regenerate",
  type: "images",
  data: {
    type: "single",
    caption: null,
    image: {
      id: null,
      url: null,
      base64: null,
      resizedImages: null,
      originalFilename: null,
    },
    images: [
      {
        id: null,
        url: null,
        base64: null,
        resizedImages: null,
        originalFilename: null,
      },
    ],
    withBorder: false,
    withBackground: false,
    stretched: false,
  },
};

const imageAndTextBlockShape: CMSImageAndTextBlock = {
  id: "to_regenerate",
  type: "image-and-text",
  data: {
    image: {
      id: null,
      url: null,
      base64: null,
      resizedImages: null,
      originalFilename: null,
    },
    text: "Nouveau texte",
    imagePlacement: "left",
  },
};

const videoBlockShape: CMSVideoBlock = {
  id: "to_regenerate",
  type: "video",
  data: {
    url: "",
    title: "Nouvelle vidéo",
  },
};

const cardsTextBlockShape: CMSCardsTextBlock = {
  id: "to_regenerate",
  type: "cards-text",
  data: {
    cards: [
      {
        variant: "white",
        title: "Nouvelle card texte",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra malesuada hendrerit.",
      },
    ],
  },
};

const cardsTextWithImageBlockShape: CMSCardsTextWithImageBlock = {
  id: "to_regenerate",
  type: "cards-text-with-image",
  data: {
    cards: [
      {
        variant: "white",
        title: "Nouvelle card texte avec image",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra malesuada hendrerit.",
        image: {
          id: null,
          url: null,
          base64: null,
          resizedImages: null,
          originalFilename: null,
        },
      },
    ],
  },
};

const cardsTextWithImageAndChipBlockShape: CMSCardsTextWithImageAndChipBlock = {
  id: "to_regenerate",
  type: "cards-text-with-image-and-chip",
  data: {
    cards: [
      {
        variant: "white",
        title: "Nouvelle card texte avec image",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra malesuada hendrerit.",
        image: {
          id: null,
          url: null,
          base64: null,
          resizedImages: null,
          originalFilename: null,
        },
        chip: {
          text: "test",
          variant: "primary",
        },
      },
    ],
  },
};

const cardPressCoverageShape: CMSCardPressCoverageBlock = {
  id: "to_regenerate",
  type: "card-press-coverage",
  data: {
    cards: [
      {
        image: {
          id: null,
          originalFilename: null,
          base64: null,
          url: "https://cdn.prod.website-files.com/6642339dc91a7d65e7ad1eed/66424bba629f59088685111a_Tudigo_logo_bk.svg",
          resizedImages: null,
        },
        content:
          "Lorem ipsum dolor sit amet consectetur. Eget ante sapien montes pellentesque donec.",
        date: "2021-01-01",
      },
    ],
  },
};

const podcastCarouselShape: CMSPodcastCarouselBlock = {
  id: "to_regenerate",
  type: "podcast-carousel",
  data: {
    podcasts: [
      {
        url: "https://open.spotify.com/embed/episode/23yFTDdAsndrK04bJyxfE9?utm_source=generator&theme=0",
      },
    ],
  },
};

const mosaicGalleryShape: CMSMosaicGalleryBlock = {
  id: "to_regenerate",
  type: "mosaic-gallery",
  data: {
    elements: [
      {
        image: {
          id: null,
          url: null,
          base64: null,
          resizedImages: null,
          originalFilename: null,
        },
      },
    ],
  },
};

const FAQShape: CMSFrequentlyAskedQuestion = {
  id: "to_regenerate",
  type: "faq-block",
  data: {
    elements: [
      {
        question: "Lorem ipsum ?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra malesuada hendrerit.",
      },
    ],
  },
};

const highlightSHape: CMSHighlightBlock = {
  id: "to_regenerate",
  type: "highlight",
  data: {
    elements: [
      {
        content:
          "LE TRAIN est le 1er opérateur français et privé de Train à Grande Vitesse pensé pour les régions loremp isupm dolore",
      },
    ],
  },
};

const cardsProfileBlockShape: CMSCardsProfileBlock = {
  id: "to_regenerate",
  type: "cards-profile",
  data: {
    cards: [
      {
        name: "Nouvelle card profil",
        job: "Job",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra malesuada hendrerit.",
        image: {
          id: null,
          url: null,
          base64: null,
          resizedImages: null,
          originalFilename: null,
        },
        linkedinProfileUrl: undefined,
      },
    ],
  },
};

const cardsQuotesBlockShape: CMSCardsQuotesBlock = {
  id: "to_regenerate",
  type: "cards-quote",
  data: {
    cards: [
      {
        quote: "Nouvelle card citation",
        name: "John",
        job: "Quote expert",
      },
    ],
  },
};

const audioBlockShape: CMSIAudioBlock = {
  id: "to_regenerate",
  type: "audio",
  data: {
    url: "",
  },
};

const analyzeBlockShape: CMSAnalyzeBlock = {
  id: "to_regenerate",
  type: "analyze",
  data: {
    author: "John Doe",
    subtitle: "Poste détaillé @Tudigo",
    content:
      "Lorem ipsum dolor sit amet consectetur. Elit nibh tincidunt est risus in nulla suspendisse. Faucibus consectetur varius turpis eget vel vestibulum mi. Et ut nullam fermentum iaculis suscipit nec euismod gravida sed. In integer senectus quam augue sed. Integer quis eget magna a. Mattis sollicitudin amet justo morbi varius viverra odio suspendisse. Diam et a purus egestas eget aliquet. Netus vivamus suscipit viverra odio. Ipsum aenean id massa magna aliquet augue nulla enim.",
    image: {
      id: null,
      url: "https://picsum.photos/80/80",
      base64: null,
      resizedImages: null,
      originalFilename: null,
    },
  },
};

const autoBlockShape: CMSAutoBlock = {
  id: "to_regenerate",
  type: "auto",
  data: {
    type: "modalities",
  },
};

const iframeBlockShape: CMSIFrameBlock = {
  id: "to_regenerate",
  type: "iframe",
  data: {
    url: "",
  },
};

export {
  headingBlockShape,
  chronologyShape,
  paragraphBlockShape,
  imageBlockShape,
  imageAndTextBlockShape,
  videoBlockShape,
  cardsTextBlockShape,
  cardsTextWithImageBlockShape,
  cardsTextWithImageAndChipBlockShape,
  clubProjectsShape,
  clubTeamLeadersShape,
  clubMediaCarouselShape,
  clubTrackRecordsShape,
  clubLeadersListShape,
  clubModalitiesCardShape,
  clubOrganizationCardShape,
  cardEventShape,
  cardPressCoverageShape,
  podcastCarouselShape,
  mosaicGalleryShape,
  FAQShape,
  cardsProfileBlockShape,
  cardsQuotesBlockShape,
  iframeBlockShape,
  audioBlockShape,
  autoBlockShape,
  analyzeBlockShape,
  highlightSHape,
};
