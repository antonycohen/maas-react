export interface Magazine {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
}

export const MOCK_MAGAZINES: Magazine[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `mag-${i}`,
  title: 'Tangente n°290',
  date: '6 mai 2025',
  imageUrl: 'https://tangente-mag.com/img/numero/vignettes/TG218couv.jpg', // Using the image from Figma
}));
