<h1 align="center">SecureAuth</h1>

<div align="center">

[![X Badge](https://img.shields.io/badge/-@akgbytes-1ca0f1?style=social&labelColor=red&logo=x&logoColor=black&link=https://x.com/akgbytes)](https://x.com/akgbytes) &nbsp;
[![LinkedIn Badge](https://img.shields.io/badge/@akgbytes-0e76a8?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/akgbytes/) &nbsp;
[![Mail Badge](https://img.shields.io/badge/-akgbytes@gmail.com-c0392b?style=flat&labelColor=c0392b&logo=gmail&logoColor=white)](mailto:akgbytes@gmail.com) &nbsp;
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org) &nbsp;
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

</div>

<div align="center">
  <img width="800" alt="SecureAuth Preview" src="./web/public/image1.png" />
  <img width="800" alt="SecureAuth Preview" src="./web/public/image2.png" />
</div>

## Overview

**SecureAuth** is a simple and complete authentication system with login, registration, email verification, password reset, sessions, and role-based access.

## Features

- **JWT Authentication**: Short-lived access tokens with refresh token rotation
- **Email Verification**: Magic link account verification & resends
- **Password Reset Flow**: Secure expiring tokens for password recovery
- **Role-Based Access Control (RBAC)**: Admin/user separation
- **Avatar Uploads**: Multer + Cloudinary integration
- **Session Management**: Track and revoke active sessions
- **Validation with Zod**: Type-safe request/response schemas
- **Reusable UI Components**: Powered by Shadcn UI + Tailwind CSS
- **Structured Logging**: With Winston & daily rotate files



## Tech Stack

### Frontend
[![React](https://img.shields.io/badge/React-20232A.svg?logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-000.svg)](https://ui.shadcn.com/)
[![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990.svg?logo=reacthookform&logoColor=white)](https://react-hook-form.com/)
[![Zod](https://img.shields.io/badge/Zod-3E67B1.svg)](https://zod.dev/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154.svg)](https://tanstack.com/query/latest)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router-000.svg)](https://tanstack.com/router/latest)
[![Zustand](https://img.shields.io/badge/Zustand-000000.svg)](https://github.com/pmndrs/zustand)

### Backend
[![Node.js](https://img.shields.io/badge/Node.js-43853D.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000.svg?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-000.svg)](https://orm.drizzle.team/)
[![Neon](https://img.shields.io/badge/Neon-04C7C1.svg)](https://neon.tech/)
[![Mailtrap](https://img.shields.io/badge/Mailtrap-3B82F6.svg)](https://mailtrap.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5.svg?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Zod](https://img.shields.io/badge/Zod-3E67B1.svg)](https://zod.dev/)
[![Winston](https://img.shields.io/badge/Winston-000.svg)](https://github.com/winstonjs/winston)


## Getting Started

### Prerequisites

Ensure you have installed:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)

### 1. Clone the repository

```bash
git clone https://github.com/akgbytes/secure-auth.git
cd secure-auth
```

### 2. Install dependencies

```bash
cd server && pnpm install
cd ../web && pnpm install
```

### 3. Set up environment variables

Copy the sample .env file and fill in your credentials:

```bash
cp .env.sample .env
```

### 4. Database Setup

```bash
cd server
pnpm db:push
```

### 5. Run the app

```bash
cd web && pnpm dev
cd ../server && pnpm dev
```

## Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open an issue or submit a PR.

## License

SecureAuth is licensed under the MIT License.
Use it freely and build something awesome.
