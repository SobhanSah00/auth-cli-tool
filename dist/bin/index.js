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
    .option("--db <type>", "Database type (mongo or prisma)")
    .option("--auth <type>", "Auth type (jwt or cookie)")
    .parse(process.argv);
const options = program.opts();
async function run() {
    let db = options.db;
    let auth = options.auth;
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
    const templatePath = path.resolve(__dirname, `../../src/templates/express-${db}-${auth}`);
    const targetPath = path.join(process.cwd(), "auth");
    if (!fs.existsSync(templatePath)) {
        console.log(chalk.red("❌ Template not found!"));
        process.exit(1);
    }
    fs.cpSync(templatePath, targetPath, { recursive: true });
    const files = fs.readdirSync(targetPath);
    console.log(chalk.blue(`✅ Auth boilerplate generated at ${targetPath}`));
    console.log(chalk.yellow("📂 Files generated:"));
    files.forEach(f => console.log(" - " + f));
    const deps = ["express", "mongoose", "jsonwebtoken", "bcryptjs", "cookie-parser"];
    const devDeps = ["@types/typescript", "ts-node", "@types/express", "@types/node", "@types/mongoose", "@types/jsonwebtoken", "@types/bcrypt"];
    console.log(chalk.green("📦 Installing project dependencies..."));
    execSync(`npm install ${deps.join(" ")}`, { cwd: targetPath, stdio: "inherit" });
    console.log(chalk.green("📦 Installing project devDependencies..."));
    execSync(`npm install -D ${devDeps.join(" ")}`, { cwd: targetPath, stdio: "inherit" });
}
run();
