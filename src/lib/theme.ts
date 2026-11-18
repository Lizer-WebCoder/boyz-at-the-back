export const colors = {
  orange: '#FF5F1F',
  charcoal: '#1E1E24',
  concrete: '#2B2B33',
  white: '#FFFFFF',
  muted: '#8A8A93',
  danger: '#E74C3C',
  success: '#2ECC71',
  warning: '#F39C12',
  border: '#3A3A45',
} as const;

export const statusLabels = {
  in_the_yard: 'In the Yard',
  solitary: 'Solitary Confinement',
  out_on_bail: 'Out on Bail',
  on_parole: 'On Parole',
} as const;

export const statusColors = {
  in_the_yard: colors.success,
  solitary: colors.danger,
  out_on_bail: colors.warning,
  on_parole: colors.muted,
} as const;

export const prisonEmojis = {
  handcuffs: '🔗',
  siren: '🚨',
  soap: '🧼',
  keys: '🔑',
  jumpsuit: '🧡',
} as const;

export type StatusKey = keyof typeof statusLabels;
