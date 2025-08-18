import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .option("--db <type>", "Database type (mongo or prisma)")
  .option("--auth <type>", "Auth type (jwt or cookie)")
  .parse(process.argv);

const options = program.opts();

async function run() {
  let db: string = options.db;
  let auth: string = options.auth;

  if (!db || !auth) {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "db",
        message: "Which database do you want to use?",
        choices: ["mongo", "prisma"],
        when: () => !db,
      },
      {
        type: "list",
        name: "auth",
        message: "Which auth method?",
        choices: ["jwt", "cookie"],
        when: () => !auth,
      },
    ]);
    db = db || answers.db;
    auth = auth || answers.auth;
  }

  console.log(chalk.green(`🚀 Generating Express auth with ${db} + ${auth}...`));

  const templatePath = path.join(__dirname, `../templates/express-${db}-${auth}`);
  const targetPath = path.join(process.cwd(), "auth");

  if (!fs.existsSync(templatePath)) {
    console.log(chalk.red("❌ Template not found!"));
    process.exit(1);
  }

  fs.cpSync(templatePath, targetPath, { recursive: true });
  console.log(chalk.blue(`✅ Auth boilerplate generated at ${targetPath}`));
}

run();
