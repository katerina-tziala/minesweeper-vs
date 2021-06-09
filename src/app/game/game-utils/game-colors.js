const COLORS = {
  light: {
    '1': '#0039e6',
    '2': '#009900',
    '3': '#ff0000',
    '4': '#ff6600',
    '5': '#b3b300',
    '6': '#9900cc',
    '7': '#ff00bf',
    '8': '#1a1a1a',
  },
  dark: {
    '1': '#00ffff',
    '2': '#00ff00',
    '3': '#ff0000',
    '4': '#ff8300',
    '5': '#ffff00',
    '6': '#b84dff',
    '7': '#ff00bf',
    '8': '#ffffff',
  }
};

export function getThemePallete(theme = 'light') {
  return COLORS[theme];
};

export function getThemeColor(theme = 'light', colorKey = '0') {
  return getThemePallete(theme)[colorKey];
};
