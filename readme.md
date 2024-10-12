# Cirkel Backend | Network and Community Social Media

## Introduction

Welcome to the backend of Cirkel, a basic social media platform designed to facilitate networking and community engagement. This repository contains the Node.js application that serves as the API for user authentication, data management, and interactions on the platform.

## Technology Stack

The Cirkel backend is built using the following technologies:

- **Node.js** (for building the server)
- **Express.js** (for API development)
- **TypeScript** (for type safety and improved developer experience)
- **JWT** (for user authentication and authorization)
- **Cloudinary** (for media storage and management)

## Installation Guidelines

To set up the Cirkel backend locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/cirkel-backend.git
   cd cirkel-backend
   ```

2. **Clone the repository:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

- Create a .env file in the root directory and configure your environment variables (e.g., database connection string, JWT secret, Cloudinary credentials, etc.).

4. **Clone the repository:**

   ```bash
   npm run dev
   ```

### How to get Connection String from MongoBD Atlas

If you know how to get Connection String from MongoBD Atlas then you can skip this step. And if you don't know then follow step by step:

- https://www.mongodb.com/ Go to this link and Sign In with google.
- Then create a user from `Database Access` tab for access to the database (when create a user try to give the role as Atlas Admin)

  ![alt text](https://i.ibb.co/FDJDqQK/Clusters-Cloud-Mongo-DB-Cloud.png)
  ![alt text](https://i.ibb.co/QPrSTPY/Database-Access-Cloud-Mongo-DB-Cloud.png)

- Then again go to `Database` tab and then click `Connect` option
- When you click the `connect` option you will see several option. click on the `Drivers` option.

  ![alt text](https://i.ibb.co/NtcJt6F/Clusters-Cloud-Mongo-DB-Cloud-2.png)

- When you click the `Drivers` option then you will see more step. Here you will see Connection String on the step 3. Just copy it and paste it on the `.env` file without any spaces.

  ![alt text](https://i.ibb.co/CWYZ5fx/Clusters-Cloud-Mongo-DB-Cloud-4.png)

- Replace `<username>` and `<password>`. When you create a user on Database Access option. You entered a username and password. just add these here. Remember, don't remove any letter or symbol from the connection string and be careful when you replace the username and password. Then give a Database name before question `?` mark and after `.mongodb.net/`. Here is an example.

```
mongodb+srv://<username>:<password>@clusterPort.mongodb.net/databaseName?othersPort
```

If you follow step by step then congratulations. Now you can run your project using below command

```
npm run start:dev
```
