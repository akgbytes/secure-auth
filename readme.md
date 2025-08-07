<h1 align="center">SecureAuth</h1>

<div align= "center">

[![X Badge](https://img.shields.io/badge/-@akgbytes-1ca0f1?style=social&labelColor=red&logo=x&logoColor=black&link=https://x.com/akgbytes)](https://x.com/akgbytes) &nbsp;
[![Linkedin Badge](https://img.shields.io/badge/@akgbytes-0e76a8)](https://www.linkedin.com/in/akgbytes/) &nbsp;
[![Mail Badge](https://img.shields.io/badge/-akgbytes@gmail.com-c0392b?style=flat&labelColor=c0392b&logo=gmail&logoColor=pink)](mailto:akgbytes@gmail.com)&nbsp;
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)&nbsp;
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

</div>

<div align="center"> <img width="700px" alt="SecureAuth Preview" src="./frontend/public/landing.png" /> </div>

</div>

<br>

## Introduction

SecureAuth is a powerful authentication system built with React, Redux Toolkit, RTK Query, Node.js, Prisma, and PostgreSQL, it includes complete flows for login, signup, email verification, password resets, image uploads, and RBAC.
<br>

## Features

- User Registration & Secure Login

- JWT Access & Refresh Tokens with Auto-Refresh

- Email Verification via OTP

- Forgot Password Flow with Expiring Token

- Role-Based Access Control (RBAC)

- Organized File and Folder Structure

- Avatar Upload with Multer + Cloudinary

- RTK Query for API Caching & Error Handling

- Reusable Components with Shadcn UI & Tailwind

- Schema Validation using Zod

- Clean Architecture & Structured Logging

<br>

## Tech Stack

### Frontend

- [React](https://react.dev/)

- [Redux Toolkit + RTK Query](https://redux-toolkit.js.org/)

- [Tailwind CSS](https://tailwindcss.com/)

- [TypeScript](https://www.typescriptlang.org/)

- [Shadcn UI](https://ui.shadcn.com/)

### Backend

- [Node.js](https://nodejs.org/)

- [Express.js](https://expressjs.com/)

- [Zod](https://zod.dev/)

- [Prisma](https://www.prisma.io)

- [Postgres](https://neon.tech/)

- [Mailtrap](https://mailtrap.io/)

<br>

## Local Development

0.  **Prerequisites** <br>
    Make sure you have the following installed on your machine:

    - [Git](https://git-scm.com/)
    - [Node.js](https://nodejs.org/en)

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/akgbytes/secure-auth.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd secure-auth
    ```

3.  **Install dependencies:**

    ```bash
    cd backend && npm install
    cd ../frontend && npm install
    ```

4.  **Add Environment Variables:**

    Create `.env` file in the root folder and copy paste the content of `.env.sample`

    ```bash
    cp .env.sample .env
    ```

    Update credentials in `.env` with your credentials.

5.  **Setup Database**

    ```bash
    cd backend
    npx prisma migrate dev --name init
    ```

6.  **Start the App:**

    ```bash
    cd frontend && npm run dev
    cd ../backend && npm run dev
    ```

    Visit &nbsp;[http://localhost:5173](http://localhost:5173)&nbsp; to access your app.

<br>

## Contributing

Contributions are more than welcome! Feel free to open issues or submit pull requests.

## License

SecureAuth is open-sourced under the [MIT License](./LICENSE). Use it freely and share what you build!
