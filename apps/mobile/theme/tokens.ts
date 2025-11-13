export const palette = {
  sky: '#7E9CCB',
  sage: '#A8D8B9',
  rose: '#E8B4B8',
  sand: '#F4D3C4',
  deep: '#1F2933',
  ink: '#111827',
  surface: '#F7F9FC',
  surfaceAlt: '#EEF4F6',
  muted: 'rgba(17, 24, 39, 0.55)',
  success: '#58B083',
  warning: '#F0B45B',
  danger: '#FF6B6B'
} as const;

export const typography = {
  heading: {
    fontFamily: 'SFProRounded-Bold',
    fontSize: 32,
    lineHeight: 36
  },
  subheading: {
    fontFamily: 'SFProRounded-SemiBold',
    fontSize: 20,
    lineHeight: 26
  },
  body: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 16,
    lineHeight: 22
  },
  caption: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 13,
    lineHeight: 18
  }
} as const;

export const radii = {
  sm: 12,
  md: 18,
  lg: 28,
  pill: 999
} as const;

export const shadows = {
  soft: {
    shadowColor: 'rgba(126, 156, 203, 0.35)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 18
  },
  floating: {
    shadowColor: 'rgba(65, 105, 225, 0.3)',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.28,
    shadowRadius: 32,
    elevation: 28
  }
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  xxl: 36
} as const;

export const tokens = {
  palette,
  typography,
  radii,
  shadows,
  spacing
};
