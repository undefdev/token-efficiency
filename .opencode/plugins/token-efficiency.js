import { readFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..", "..");
const skillsDir = join(rootDir, "skills");

export default {
  name: "token-efficiency",
  skills: readdirSync(skillsDir)
    .filter((d) => statSync(join(skillsDir, d)).isDirectory())
    .map((d) => ({
      name: d,
      path: join(skillsDir, d, "SKILL.md"),
      content: readFileSync(join(skillsDir, d, "SKILL.md"), "utf-8"),
    })),
};
