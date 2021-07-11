const COLORS = {
  light: {
    'type-1': '#005ce6',
    'type-2': '#009900',
    'type-3': '#ff0000',
    'type-4': '#ff6600',
    'type-5': '#b3b300',
    'type-6': '#9900cc',
    'type-7': '#ff00bf',
    'type-8': '#1a1a1a',
  },
  dark: {
    'type-1': '#00ffff',
    'type-2': '#00ff00',
    'type-3': '#ff0000',
    'type-4': '#ff8300',
    'type-5': '#ffff00',
    'type-6': '#b84dff',
    'type-7': '#ff00bf',
    'type-8': '#ffffff',
  }
};

export function getThemePalette(theme = 'light') {
  return COLORS[theme];
};

export function getThemeColor(theme = 'light', colorKey = '0') {
  return getThemePalette(theme)[colorKey];
};
