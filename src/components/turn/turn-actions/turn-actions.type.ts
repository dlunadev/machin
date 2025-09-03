export type TurnActionsProps = {
  primaryAction: { label: string; onPress: () => void; outlined?: boolean; icon: React.ReactNode };
  secondaryAction: { label: string; onPress: () => void; icon: React.ReactNode };
};
