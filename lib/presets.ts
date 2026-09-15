export type ColorPreset = {
  name: string;
  primaryColor: string;
  secondaryColor: string;
};

export const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Cobalt', primaryColor: '#2f6fed', secondaryColor: '#14161b' },
  { name: 'Slate', primaryColor: '#334155', secondaryColor: '#0f172a' },
  { name: 'Forest', primaryColor: '#15803d', secondaryColor: '#14532d' },
  { name: 'Amber', primaryColor: '#b45309', secondaryColor: '#78350f' },
  { name: 'Plum', primaryColor: '#7e22ce', secondaryColor: '#581c87' },
  { name: 'Rose', primaryColor: '#be123c', secondaryColor: '#881337' },
  { name: 'Teal', primaryColor: '#0f766e', secondaryColor: '#134e4a' },
  { name: 'Graphite', primaryColor: '#14161b', secondaryColor: '#3b3f47' },
];
