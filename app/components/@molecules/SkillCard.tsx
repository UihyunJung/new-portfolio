import { type ComponentType } from 'react';
import styles from './SkillCard.module.scss';

interface SkillCardProps {
  name: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
}

export default function SkillCard({ name, icon: Icon }: SkillCardProps) {
  return (
    <div className={styles.card}>
      {Icon && <Icon size={16} className={styles.icon} aria-hidden="true" />}
      {name}
    </div>
  );
}
