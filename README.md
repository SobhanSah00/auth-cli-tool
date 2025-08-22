# 🔐 Auth CLI Tool

A **Command Line Interface (CLI) tool** to instantly scaffold **Express.js authentication boilerplates** with **TypeScript + ESM** support.  
It saves time by generating ready-to-use authentication projects with **MongoDB (Mongoose)** or **PostgreSQL (Prisma)** and **JWT / Cookie-based** authentication strategies.

---

## 📌 Why this tool?

Instead of manually setting up authentication every time you start a new project, this tool generates a clean, extensible boilerplate with all the necessary code and dependencies pre-installed.  
You just run **one command** and start coding your business logic 🚀.

---

## 🛠 Tech Stack

The generated projects use:

- **Node.js** + **Express.js**
- **TypeScript** (strict mode enabled, full ESM)
- **Authentication**
  - JWT-based auth
  - Cookie-based auth
- **Databases**
  - MongoDB with **Mongoose**
  - PostgreSQL with **Prisma ORM**
- **Utilities**
  - Bcrypt.js for password hashing
  - Cookie-parser (if using cookies)
  - JSON Web Token
- Auto-generated `.env` file with placeholders
- For Prisma projects → includes `schema.prisma` + auto `npx prisma generate`

---

## 📦 Installation

You can install globally or run with `npx`:

```bash
# Global install (recommended)
npm install -g auth-cli-tool

#then any time use ny typing this command
auth-cli-tool

# OR run directly without install
npx auth-cli-tool
