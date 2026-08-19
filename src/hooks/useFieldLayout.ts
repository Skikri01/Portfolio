import { SKILLS } from '../data/portfolio-data';
import { computeSkillUsage } from './useSkillUsage';

export interface OrbItem {
  id: string;
  categoryId: string;
  label: string;
  weight: number;
  x: number;
  y: number;
}

export function buildFieldLayout(
  skills: typeof SKILLS,
  usage: ReturnType<typeof computeSkillUsage>
): OrbItem[] {
  const usageMap = new Map(usage.map((u) => [`${u.categoryId}:${u.skill}`, u]));
  const orbs: OrbItem[] = [];

  const totalCategories = skills.length;
  skills.forEach((cat, cIdx) => {
    const angleBase = (cIdx / totalCategories) * Math.PI * 2;
    cat.items.forEach((skill, sIdx) => {
      const id = `${cat.id}:${skill}`;
      const u = usageMap.get(id);
      const usageCount = u ? u.usageCount : 0;
      const weight = 0.85 + Math.min(usageCount * 0.18, 0.5);

      const angle = angleBase + (sIdx - (cat.items.length - 1) / 2) * 0.28;
      const radius = 0.2 + (sIdx % 3) * 0.08;
      const x = 0.5 + Math.cos(angle) * radius;
      const y = 0.5 + Math.sin(angle) * radius;

      orbs.push({
        id,
        categoryId: cat.id,
        label: skill,
        weight,
        x,
        y,
      });
    });
  });

  return orbs;
}
