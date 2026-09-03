import fs from "fs";
import path from "path";

let cachedKnowledge: string | null = null;

export function getFullKnowledgeBase(): string {
  if (cachedKnowledge) {
    return cachedKnowledge;
  }

  const knowledgeDir = path.join(process.cwd(), "knowledge");
  const files = [
    "about_me.md",
    "services.md",
    "pricing.md",
    "technologies.md",
    "veera.md",
    "pestrisk.md",
    "rio.md",
    "sales_rules.md",
    "faq.md",
  ];

  const sections: string[] = [];

  for (const file of files) {
    const filePath = path.join(knowledgeDir, file);
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf8");
        sections.push(`=== FILE: ${file} ===\n${content.trim()}`);
      }
    } catch (err) {
      console.error(`Failed to read knowledge file ${file}:`, err);
    }
  }

  cachedKnowledge = sections.join("\n\n");
  return cachedKnowledge;
}
