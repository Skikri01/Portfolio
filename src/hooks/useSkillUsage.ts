import { SKILLS, EXPERIENCES } from '../data/portfolio-data';

export interface SkillUsage {
  categoryId: string;
  skill: string;
  usageCount: number;
  usedIn: string[];
}

export function computeSkillUsage(
  skills: typeof SKILLS,
  experiences: typeof EXPERIENCES
): SkillUsage[] {
  const result: SkillUsage[] = [];

  skills.forEach((cat) => {
    cat.items.forEach((skill) => {
      const usedIn: string[] = [];
      experiences.forEach((exp) => {
        if (exp.techTags.some((tag) => tag.toLowerCase() === skill.toLowerCase())) {
          if (!usedIn.includes(exp.company)) {
            usedIn.push(exp.company);
          }
        }
      });

      result.push({
        categoryId: cat.id,
        skill,
        usageCount: usedIn.length,
        usedIn,
      });
    });
  });

  return result;
}
