const COLORS = {
  light: {
    '1': '#0039e6',
    '2': '#009900',
    // '3': '#ff0000', // red
    '3': '#ff6600',
    '4': '#b3b300',
    '5': '#9900cc',
    '6': '#ff00bf',
    '7': '#1a1a1a',
  },
  dark: {
    '1': '#00ffff',
    '2': '#00ff00',
    //'3': '#ff0000',
    '3': '#ff8300',
    '4': '#ffff00',
    '5': '#b84dff',
    '6': '#ff00bf',
    '7': '#ffffff',
  }
};

export function getThemePallete(theme = 'light') {
  return COLORS[theme];
};

export function getThemeColor(theme = 'light', colorKey = '0') {
  return getThemePallete(theme)[colorKey];
};
