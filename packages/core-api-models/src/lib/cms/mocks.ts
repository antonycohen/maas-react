import { CMSBlock } from "./models";

export const mockBlocks: CMSBlock[] = [
  {
    id: "0",
    type: "heading",
    data: {
      level: 2,
      title: "Dernières actualités",
      caption: null,
    },
  },
  {
    id: "1",
    type: "heading",
    data: {
      level: 3,
      title: "Le dernier podcast",
      caption: null,
    },
  },
  // {
  //   type: "iframe",
  //   data: {
  //     url: "https://tudigo.co",
  //   },
  // },
  {
    id: "2",
    type: "heading",
    data: {
      level: 2,
      title: "Le projet",
      caption: null,
    },
  },
  {
    id: "3",
    type: "paragraph",
    data: {
      text: "LE TRAIN est le 1er opérateur français et privé de Train à Grande Vitesse pensé pour les régions. Voici les points clés du projet :",
    },
  },
  {
    id: "4",
    type: "list",
    data: {
      type: "unordered",
      content: [
        "<b>L'ambition de faire voyager 3M de passagers/an dans la région Grand Ouest dès la première année d'exploitation</b>",
        "<b>Le seul opérateur privé sur la zone</b>",
        "<b>Un impact positif sur le pouvoir d’achat grâce à la baisse des prix dû à l'ouverture à la concurrence et les émissions de CO2 (48 000 tonnes d’équivalent carbone économisées par an.) grâce aux trajets voiture évités</b>",
        "<b>Des investisseurs de 1er rang et plusieurs millions déjà sécurisés</b>",
        "<b>Une équipe solide avec à la tête l’ancien directeur des grands projets de la Région de bordeaux pour SNCF Réseau</b>",
        "<b>Des perspectives de valorisation importante : NTV, l’équivalent italien a été racheté 2 milliards € après 6 ans d’exploitation.</b>",
      ],
    },
  },
  {
    id: "5",
    type: "heading",
    data: {
      level: 2,
      title: "Les raisons d'investir",
      caption: null,
    },
  },
  {
    id: "6",
    type: "heading",
    data: {
      level: 3,
      title: "Les premières raisons d'investir",
      caption: null,
    },
  },
  {
    id: "7",
    type: "cards-text",
    data: {
      cards: [
        {
          title: "Opérateur certifié",
          text: "LE TRAIN a obtenu les accords commerciaux et réglementaires nécessaires au démarrage de l’exploitation en 2025.",
        },
        {
          title: "Des investisseurs de confiance",
          text: "LE TRAIN a sécurisé 10M€ auprès d'investisseurs institutionnels et de fonds spécialisés. ",
        },
      ],
    },
  },
  {
    id: "8",
    type: "cards-text",
    data: {
      cards: [
        {
          title: "Une équipe d’expert",
          text: "Une équipe d’expert dans le secteur ferroviaire français et internationnal",
        },
        {
          title: "Retour sur investissement attractif",
          text: "LE TRAIN sera une cible attractive pour les opérateurs ou infrastructures ferroviaires cherchant à se développer en France.",
        },
      ],
    },
  },
  {
    id: "9",
    type: "heading",
    data: {
      level: 3,
      title: "Les autre raisons d’investir",
      caption: null,
    },
  },
  {
    id: "10",
    type: "cards-text",
    data: {
      cards: [
        {
          title: "Opérateur certifié",
          text: "LE TRAIN a obtenu les accords commerciaux et réglementaires nécessaires au démarrage de l’exploitation en 2025.",
          variant: "green",
        },
        {
          title: "Des investisseurs de confiance",
          text: "LE TRAIN a sécurisé 10M€ auprès d'investisseurs institutionnels et de fonds spécialisés. ",
          variant: "green",
        },
      ],
    },
  },
  {
    id: "11",
    type: "cards-text",
    data: {
      cards: [
        {
          title: "Une équipe d’expert",
          text: "Une équipe d’expert dans le secteur ferroviaire français et internationnal",
          variant: "green",
        },
        {
          title: "Retour sur investissement attractif",
          text: "LE TRAIN sera une cible attractive pour les opérateurs ou infrastructures ferroviaires cherchant à se développer en France.",
          variant: "green",
        },
      ],
    },
  },
  {
    id: "12",
    type: "heading",
    data: {
      level: 2,
      title:
        "Des investisseurs de premiers rangs ayant déjà accepté d'investir plus de 100M€",
      caption: null,
    },
  },
  {
    id: "13",
    type: "cards-text-with-image",
    data: {
      cards: [
        {
          image: {
            id: null,
            base64: null,
            resizedImages: null,
            originalFilename: null,
            url: "https://picsum.photos/100",
          },
          title: "1,1M€",
          text: "Apport des fondateurs et du tissu économique local à la création",
        },
        {
          image: {
            id: null,
            base64: null,
            resizedImages: null,
            originalFilename: null,
            url: "https://picsum.photos/100",
          },
          title: "1M€",
          text: "Pré-Série A (2022)",
        },
        {
          image: {
            id: null,
            base64: null,
            resizedImages: null,
            originalFilename: null,
            url: "https://picsum.photos/100",
          },
          title: "2,5M€",
          text: "Pré-Série A (2022)",
        },
      ],
    },
  },
  {
    id: "14",
    type: "heading",
    data: {
      level: 2,
      title:
        "Lorem ipsum dolor sit amet consectetur. Tempus pharetra porttitor condimentum ultricies.",
      caption: null,
    },
  },
  {
    id: "15",
    type: "cards-text-with-image",
    data: {
      cards: [
        {
          image: {
            id: null,
            base64: null,
            resizedImages: null,
            originalFilename: null,
            url: "https://picsum.photos/100",
          },
          title: "Lorem ipsum dolor",
        },
        {
          image: {
            id: null,
            base64: null,
            resizedImages: null,
            originalFilename: null,
            url: "https://picsum.photos/100",
          },
          title: "Lorem ipsum dolor",
        },
        {
          image: {
            id: null,
            base64: null,
            resizedImages: null,
            originalFilename: null,
            url: "https://picsum.photos/100",
          },
          title: "Lorem ipsum dolor",
        },
      ],
    },
  },
  {
    id: "16",
    type: "heading",
    data: {
      level: 2,
      title: "Le constat",
      caption: null,
    },
  },
  {
    id: "17",
    type: "paragraph",
    data: {
      spoiler: true,
      text:
        "Lorem ipsum dolor sit amet consectetur. Ipsum in cras arcu imperdiet ut nisi amet a. <br />Pulvinar mattis malesuada at in nulla volutpat enim lorem convallis. <br />In lectus nec ac non elementum semper. <br />Velit sed euismod rhoncus tortor ultrices tortor pharetra. <br />Curabitur mauris sed cursus varius. <br />Venenatis ipsum etiam molestie sed sed consectetur. <br />Urna tincidunt bibendum aliquet molestie arcu lorem aenean.\n" +
        "Velit sed euismod rhoncus tortor ultrices tortor pharetra. <br />Curabitur mauris sed cursus varius. <br />Venenatis ipsum etiam molestie sed sed consectetur. <br />Urna tincidunt bibendum aliquet molestie arcu lorem aenean.",
    },
  },
  {
    id: "18",
    type: "heading",
    data: {
      level: 2,
      title: "Les grandes étapes du projet",
      caption: null,
    },
  },
  {
    id: "19",
    type: "chronology",
    data: {
      chronology: [
        {
          date: "28 décembre 2023",
          title: "Title",
          text: "Vous avezLorem ipsum dolor sit amet consectetur. Tincidunt ipsum pretium sit est commodo et tempus nunc sodales. Donec gravida phasellus sollicitudin hendrerit in id tristique egestas. Nisl ultrices sed mauris mattis. Enim habitasse nisi dignissim sit. Faucibus sed facilisis et sit fusce. déclaré Caroline Durand de Neofa comme étant votre conseiller en gestion de patrimoine",
          image: {
            id: null,
            url: "https://picsum.photos/500/200",
            base64: null,
            originalFilename: null,
            resizedImages: null,
          },
        },
        {
          date: "28 décembre 2023",
          title: "Title",
          text: "Vous avezLorem ipsum <b>dolor sit amet consectetur. Tincidunt ipsum</b> pretium sit est commodo et tempus nunc sodales. Donec gravida phasellus sollicitudin hendrerit in id tristique egestas. Nisl ultrices sed mauris mattis. Enim habitasse nisi dignissim sit. Faucibus sed facilisis et sit fusce. déclaré Caroline Durand de Neofa comme étant votre conseiller en gestion de patrimoine",
          image: {
            id: null,
            url: "https://picsum.photos/500/200",
            base64: null,
            originalFilename: null,
            resizedImages: null,
          },
          imageCaption:
            "Ceci est une légende qui peut être courte ou bien très longue.",
        },
        {
          date: "28 décembre 2023",
          title: "Title",
          text: "Vous avezLorem ipsum <b>dolor sit amet consectetur. Tincidunt ipsum</b> pretium sit est commodo et tempus nunc sodales. Donec gravida phasellus sollicitudin hendrerit in id tristique egestas. Nisl ultrices sed mauris mattis. Enim habitasse nisi dignissim sit. Faucibus sed facilisis et sit fusce. déclaré Caroline Durand de Neofa comme étant votre conseiller en gestion de patrimoine",
          image: {
            id: null,
            url: "https://picsum.photos/500/200",
            base64: null,
            originalFilename: null,
            resizedImages: null,
          },
          imageCaption:
            "Ceci est une légende qui peut être courte ou bien très longue.",
        },
      ],
    },
  },
  {
    id: "20",
    type: "heading",
    data: {
      level: 2,
      title: "Le projet en bref",
      caption: null,
    },
  },
  {
    id: "21",
    type: "heading",
    data: {
      level: 3,
      title: "Lorem ipsum",
      caption: null,
    },
  },
  {
    id: "22",
    type: "image-and-text",
    data: {
      imagePlacement: "left",
      image: {
        id: null,
        url: "https://picsum.photos/500/200",
        base64: null,
        originalFilename: null,
        resizedImages: null,
      },
      text: "Lorem ipsum dolor sit amet consectetur. Ipsum in cras arcu imperdiet ut nisi amet a. Pulvinar mattis malesuada at in nulla volutpat enim lorem convallis. In lectus nec ac non elementum semper. Velit sed euismod rhoncus tortor ultrices tortor pharetra. Curabitur mauris sed cursus varius. Venenatis ipsum etiam molestie sed sed consectetur. Urna tincidunt bibendum aliquet Urna tincidunt bibendum aliquet Urna tincidunt bibendum aliquet",
    },
  },
  {
    id: "23",
    type: "heading",
    data: {
      level: 3,
      title: "Lorem ipsum",
      caption: null,
    },
  },
  {
    id: "24",
    type: "image-and-text",
    data: {
      imagePlacement: "right",
      image: {
        id: null,
        url: "https://picsum.photos/500/200",
        base64: null,
        originalFilename: null,
        resizedImages: null,
      },
      text: "Lorem ipsum dolor sit amet consectetur. Ipsum in cras arcu imperdiet ut nisi amet a. Pulvinar mattis malesuada at in nulla volutpat enim lorem convallis. In lectus nec ac non elementum semper. Velit sed euismod rhoncus tortor ultrices tortor pharetra. Curabitur mauris sed cursus varius. Venenatis ipsum etiam molestie sed sed consectetur. Urna tincidunt bibendum aliquet Urna tincidunt bibendum aliquet Urna tincidunt bibendum aliquet",
    },
  },
  {
    id: "25",
    type: "heading",
    data: {
      level: 2,
      title: "Lorem ipsum",
      caption: null,
    },
  },
  {
    id: "26",
    type: "paragraph",
    data: {
      text: "Vous avezLorem ipsum:",
    },
  },
  {
    id: "27",
    type: "paragraph",
    data: {
      text: " dolor sit amet consectetur. Tincidunt ipsum pretium sit est commodo et tempus nunc sodales. Donec gravida phasellus sollicitudin hendrerit in id tristique egestas. Nisl ultrices sed mauris mattis. Enim habitasse nisi dignissim sit. Faucibus sed facilisis et sit fusce. déclaré Caroline Durand de Neofa comme étant votre conseiller en gestion de patrimoine",
    },
  },
  {
    id: "28",
    type: "list",
    data: {
      type: "ordered",
      content: [
        "Vous avezLorem ipsum dolor sit amet consectetur. Tincidunt ipsum pretium sit est commodo et tempus nunc sodales. Donec gravida phasellus sollicitudin hendrerit in id tristique egestas. ",
        "Vous avezLorem ipsum dolor sit amet consectetur. Tincidunt ipsum pretium sit est commodo et tempus nunc sodales. Donec gravida phasellus sollicitudin hendrerit in id tristique egestas. ",
        "Vous avezLorem ipsum dolor sit amet consectetur. Tincidunt ipsum pretium sit est commodo et tempus nunc sodales. Donec gravida phasellus sollicitudin hendrerit in id tristique egestas. ",
      ],
    },
  },
  {
    id: "29",
    type: "list",
    data: {
      type: "unordered",
      content: [
        "Vous avezLorem ipsum dolor sit amet consectetur. Tincidunt ipsum pretium sit est commodo et tempus nunc sodales. Donec gravida phasellus sollicitudin hendrerit in id tristique egestas. ",
        "Vous avezLorem ipsum dolor sit amet consectetur. Tincidunt ipsum pretium sit est commodo et tempus nunc sodales. Donec gravida phasellus sollicitudin hendrerit in id tristique egestas. ",
        "Vous avezLorem ipsum dolor sit amet consectetur. Tincidunt ipsum pretium sit est commodo et tempus nunc sodales. Donec gravida phasellus sollicitudin hendrerit in id tristique egestas. ",
      ],
    },
  },
  {
    id: "30",
    type: "paragraph",
    data: {
      text: "Aujourd'hui, LE TRAIN lève jusqu'à <b>3M€ avec Tudigo contre 7 % du capital</b> pour compléter une Série A de 8M€, avant de réaliser pour le second semestre 2023 une série B de 36M€ (déjà 25M€ sécurisés) pour soutenir le lancement commercial.",
    },
  },
  {
    id: "31",
    type: "paragraph",
    data: {
      text: "Le besoin en financement du matériel roulant s'élève à 285M€, 70% en dettes en cours de validation et 30% en equity, la partie equity <b>de 85M€ est sécurisée à 100%</b>.",
    },
  },
  {
    id: "32",
    type: "heading",
    data: {
      level: 2,
      title: "L’Équipe",
      caption: null,
    },
  },
  {
    id: "33",
    type: "cards-profile",
    data: {
      cards: [
        {
          image: {
            id: null,
            base64: null,
            resizedImages: null,
            originalFilename: null,
            url: "https://picsum.photos/100",
          },
          name: "USERNAME",
          job: "Intitulé du poste",
          text: "Lorem ipsum dolor sit amet consectetur. Eget ante sapien montes pellentesque donec.",
        },
        {
          image: {
            id: null,
            base64: null,
            resizedImages: null,
            originalFilename: null,
            url: "https://picsum.photos/100",
          },
          name: "USERNAME",
          job: "Intitulé du poste",
          text: "Lorem ipsum dolor sit amet consectetur. Eget ante sapien montes pellentesque donec.",
        },
        {
          image: {
            id: null,
            base64: null,
            resizedImages: null,
            originalFilename: null,
            url: "https://picsum.photos/100",
          },
          name: "USERNAME",
          job: "Intitulé du poste",
          text: "Lorem ipsum dolor sit amet consectetur. Eget ante sapien montes pellentesque donec.",
        },
      ],
    },
  },
  {
    id: "34",
    type: "heading",
    data: {
      level: 2,
      title: "Quote, testimonial",
      caption: null,
    },
  },
  {
    id: "35",
    type: "cards-quote",
    data: {
      cards: [
        {
          name: "Username",
          job: "Position",
          quote: "Citation",
        },
      ],
    },
  },
  {
    id: "36",
    type: "heading",
    data: {
      level: 2,
      title: "Les modalités de financement",
      caption: null,
    },
  },
  {
    id: "37",
    type: "table",
    data: {
      title: "Modalités d’investissement",
      content: [
        ["Instrument financier", "Actions"],
        ["Defiscalisation", "IR-PME, Apport-cession, PEA/PEA-PME"],
        ["Ticket minimum", "1 000€"],
        ["Montant plancher", "200 000 €"],
        ["Montant maximum recherché", "500 000 €"],
        ["Remboursement des intérêts", "10%"],
        ["Taux d'intérêt annuel net d'impôt ", "10%"],
        ["Frais d'entrée", "0"],
        ["Frais de gestion", "0"],
        ["Moyen de paiement :", "Carte bancaire, virement, virement PEA-PME"],
      ],
    },
  },
  {
    id: "38",
    type: "heading",
    data: {
      level: 2,
      title: "Caroussel",
      caption: null,
    },
  },
  {
    id: "39",
    type: "carousel",
    data: {
      images: [
        {
          url: "https://picsum.photos/1000/600",
          caption:
            "Ceci est une légende qui peut être courte ou bien très longue.",
        },
        {
          url: "https://picsum.photos/1000/600",
          caption:
            "Ceci est une légende qui peut être courte ou bien très longue.",
        },
      ],
    },
  },
  {
    id: "40",
    type: "heading",
    data: {
      level: 2,
      title: "Image",
      caption: null,
    },
  },
  {
    id: "41",
    type: "images",
    data: {
      type: "single",
      images: [],
      image: {
        id: null,
        url: "https://picsum.photos/500/200",
        base64: null,
        originalFilename: null,
        resizedImages: null,
      },
      caption: "Ceci est une légende qui peut être courte ou bien très longue.",
      withBorder: null,
      withBackground: null,
      stretched: null,
    },
  },
  {
    id: "42",
    type: "heading",
    data: {
      level: 2,
      title: "Vidéo",
      caption: null,
    },
  },
  // {
  //   type: "iframe",
  //   data: {
  //     url: "https://www.youtube.com/embed/WPA87rohtL0?si=KhMqhD8mTI6EO27O",
  //     width: 560,
  //     height: 315,
  //     title: " PimpUp | Investissement participatif sur Tudigo - Crowdfunding ",
  //   },
  // },
  {
    id: "43",
    type: "heading",
    data: {
      level: 2,
      title: "Lorem",
      caption: null,
    },
  },
  {
    id: "44",
    type: "gallery",
    data: {
      images: [
        { url: "https://picsum.photos/501" },
        { url: "https://picsum.photos/502" },
        { url: "https://picsum.photos/503" },
        { url: "https://picsum.photos/504" },
        { url: "https://picsum.photos/505" },
      ],
    },
  },
  {
    id: "45",
    type: "paragraph",
    data: {
      text: "Risques liés à l’investissement<br /><br /><br />Tout investissement présente des risques de perte totale ou partielle du capital investi. Les dispositifs fiscaux mentionnés ne constituent pas des conseils. Chaque investisseur est responsable de consulter un avocat spécialisé en fiscalité ou les autorités fiscales pour déterminer s'il est éligible aux dispositifs fiscaux présentés. Les estimations données ne s’appliquent qu’aux investissements réalisés en tant que personne physique résidente fiscale française.",
    },
  },
];
