#!/usr/bin/env node
import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .option("--db <type>", "Database type (mongo-mongoose or postgres-prisma)")
  .option("--auth <type>", "Auth type (jwt or cookie)")
  .parse(process.argv);

const options = program.opts();

function generateEnv(targetPath: string) {
  const envContent = `# Environment variables
PORT=8080
DB_URL=put your own connection url mongo/postgres/sql
JWT_SECRET=auth-cli-tool
  `;

  fs.writeFileSync(path.join(targetPath, ".env"), envContent);
  console.log("✅ .env file created at root of project");
}

async function run() {
  let db: string = options.db;
  let auth: string = options.auth;

  if (!db || !auth) {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "db",
        message: "Which database do you want to use?",
        choices: ["mongo-mongoose", "postgres-prisma"],
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

  const templatePath = path.resolve(
    __dirname,
    `../../src/templates/express-${db}-${auth}`
  );
  const targetPath = path.join(process.cwd(), "auth");

  if (!fs.existsSync(templatePath)) {
    console.log(chalk.red("❌ Template not found!"));
    process.exit(1);
  }

  fs.cpSync(templatePath, targetPath, { recursive: true });

  const files = fs.readdirSync(targetPath);
  console.log(chalk.blue(`✅ Auth boilerplate generated at ${targetPath}`));
  console.log(chalk.yellow("📂 Files generated:"));
  files.forEach((f) => console.log(" - " + f));

  generateEnv('auth');

  // 👉 Install dependencies based on db choice
  if (db === "mongo-mongoose") {
    const deps = [
      "express",
      "mongoose",
      "jsonwebtoken",
      "bcryptjs",
      "cookie-parser",
    ];
    const devDeps = [
      "typescript",
      "ts-node",
      "@types/express",
      "@types/node",
      "@types/mongoose",
      "@types/jsonwebtoken",
      "@types/bcryptjs",
    ];

    console.log(chalk.green("📦 Installing Mongo dependencies..."));
    execSync(`npm install ${deps.join(" ")}`, {
      cwd: targetPath,
      stdio: "inherit",
    });

    console.log(chalk.green("📦 Installing Mongo devDependencies..."));
    execSync(`npm install -D ${devDeps.join(" ")}`, {
      cwd: targetPath,
      stdio: "inherit",
    });
  }

  if (db === "postgres-prisma") {
    const deps = ["express", "@prisma/client", "jsonwebtoken", "bcryptjs", "cookie-parser"];
    const devDeps = [
      "typescript",
      "ts-node",
      "prisma",
      "@types/express",
      "@types/node",
      "@types/jsonwebtoken",
      "@types/bcryptjs",
    ];

    console.log(chalk.green("📦 Installing Prisma dependencies..."));
    execSync(`npm install ${deps.join(" ")}`, {
      cwd: targetPath,
      stdio: "inherit",
    });

    console.log(chalk.green("📦 Installing Prisma devDependencies..."));
    execSync(`npm install -D ${devDeps.join(" ")}`, {
      cwd: targetPath,
      stdio: "inherit",
    });

    // Run prisma generate
    console.log(chalk.green("⚙️ Running Prisma generate..."));
    execSync(`npx prisma generate`, {
      cwd: targetPath,
      stdio: "inherit",
    });
  }
}

run();