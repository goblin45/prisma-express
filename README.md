# Prisma Setup

*You can copy everything as it is, understand the workflow, then try your own implementation.*

*For GUI support of PostgreSQL (locally), download [pgAdmin](https://www.pgadmin.org/download/pgadmin-4-windows/).*

## Install PostgreSQL Locally
Make sure you have PostgreSQL installed on your local machine. You can download it from the [official PostgreSQL website](https://www.postgresql.org/download/).

## Create a Database and User
Once PostgreSQL is installed, you can create a database and a user using the following commands in the PostgreSQL shell:

```sql
-- Open PostgreSQL shell
psql -U postgres

-- Create a new database
CREATE DATABASE mydatabase;

-- Create a new user
CREATE USER myuser WITH PASSWORD 'mypassword';

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;
```

## Set Up Environment Variables
Update your .env file with the connection details for your local PostgreSQL server:

```
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydatabase"
```

If permission issues exists later use this instead:

```
DATABASE_URL="postgresql://postgres:superuserpassword@localhost:5432/mydatabase"
```

`superuserpassword` is the password you set while installing PostgreSQL on your system.

## Initialize Prisma in Project
This will create `prisma/schema.prisma`.

```bash
npx prisma init
```

## Prisma Schema Configuration
Ensure your `prisma/schema.prisma` file is configured to use the environment variable for the database URL:

```
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
}
```

## Initialize Prisma Client
Create a `prismaClient.js` file to initialize the Prisma Client:

```javascript
// prismaClient.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;
```


## Integrate with Express App

Create `server.js` and add this code to it:

```js
const express = require('express');
const bodyParser = require('body-parser');
const prisma = require('./prismaClient');

const app = express();
app.use(bodyParser.json());

const port = 3000;

// Create a new user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'User could not be created' });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Users could not be fetched' });
  }
});

// Get a single user by ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'User could not be fetched' });
  }
});

// Update a user by ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'User could not be updated' });
  }
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'User could not be deleted' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

## Run Migrations and Generate Prisma Client
Run the Prisma migration to create the necessary tables in your PostgreSQL database:

```bash
npx prisma migrate dev --name init
```

Generate Prisma Client
```bash
npx prisma generate
```

If an issue like this is raised:

```
Error: 
EPERM: operation not permitted, unlink 'D:\Work\My Dev Practice\DB practice\Prisma practice\node_modules\.prisma\client\query_engine-windows.dll.node'
```

try deleting `node_modules` and `package-lock.json` and reinstalling dependencies and restarting the server. That worked for me!