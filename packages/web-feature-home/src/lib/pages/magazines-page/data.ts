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
  imageUrl: 'http://localhost:3845/assets/09e96c1a4572388cdf4e6b77da68f947c15f5c6d.png', // Using the image from Figma
}));
