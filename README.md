# Cat Cafe Backend

This is the backend for the Cat Cafe Webshop, built with [NestJS](https://nestjs.com/) and [Prisma](https://www.prisma.io/).

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Docker](https://www.docker.com/) (optional, for running the database)
- [MySQL](https://www.mysql.com/) (if not using Docker)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/energypatrikhu/cat-cafe-backend
cd cat-cafe-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
DATABASE_URL="mysql://<username>:<password>@<host>:<port>/<database>"
```

You can use the `.env.example` file as a reference.

### 4. Set Up the Database

#### Option 1: Using Docker

Run the following command to start a MySQL container:

```bash
docker run --name cat-cafe-db -e MYSQL_ROOT_PASSWORD=cat-cafe-psw -e MYSQL_DATABASE=cat-cafe-db -p 3306:3306 -d mysql:latest
```

#### Option 2: Using a Local MySQL Instance

Ensure you have a MySQL database running and update the `DATABASE_URL` in the `.env` file accordingly.

### 5. Push Prisma Schema to the Database

Run the following command to apply the Prisma schema to the database:

```bash
npx prisma db push
```

### 6. Seed the Database (Optional)

To populate the database with sample data, run:

```bash
npm run build
npm run prisma:seed
```

### 7. Start the Application

#### Development Mode

```bash
npm run start:dev
```

#### Production Mode

Build the project and start the server:

```bash
npm run build
npm run start:prod
```

The application will be available at `http://localhost:3000`.

## API Documentation

The API documentation is available at the root URL (`http://localhost:3000`) using Swagger.

## Docker Deployment

To deploy the application using Docker, build and run the Docker container:

```bash
docker build -t cat-cafe-backend .
docker run -p 3000:3000 --env-file .env cat-cafe-backend
```

---

# Cat Cafe Backend

Ez a Cat Cafe Webshop backendje, amely [NestJS](https://nestjs.com/) és [Prisma](https://www.prisma.io/) használatával készült.

## Előfeltételek

A projekt beállítása előtt győződj meg arról, hogy a következők telepítve vannak:

- [Node.js](https://nodejs.org/) (ajánlott az LTS verzió)
- [npm](https://www.npmjs.com/) (a Node.js része)
- [Docker](https://www.docker.com/) (opcionális, az adatbázis futtatásához)
- [MySQL](https://www.mysql.com/) (ha nem használod a Dockert)

## Beállítási útmutató

### 1. Klónozd a repót

```bash
git clone https://github.com/energypatrikhu/cat-cafe-backend
cd cat-cafe-backend
```

### 2. Függőségek telepítése

```bash
npm install
```

### 3. Környezeti változók konfigurálása

Hozz létre egy `.env` fájlt a gyökérkönyvtárban, és konfiguráld a következő változókat:

```env
DATABASE_URL="mysql://<felhasználónév>:<jelszó>@<hoszt>:<port>/<adatbázis>"
```

Használhatod a `.env.example` fájlt referenciaként.

### 4. Adatbázis beállítása

#### Opció 1: Docker használatával

Futtasd az alábbi parancsot egy MySQL konténer indításához:

```bash
docker run --name cat-cafe-db -e MYSQL_ROOT_PASSWORD=cat-cafe-psw -e MYSQL_DATABASE=cat-cafe-db -p 3306:3306 -d mysql:latest
```

#### Opció 2: Helyi MySQL példány használatával

Győződj meg arról, hogy egy MySQL adatbázis fut, és frissítsd a `.env` fájlban a `DATABASE_URL` értékét ennek megfelelően.

### 5. Prisma séma alkalmazása az adatbázisra

Futtasd az alábbi parancsot a Prisma séma alkalmazásához az adatbázisra:

```bash
npx prisma db push
```

### 6. Adatbázis feltöltése (opcionális)

Az adatbázis feltöltéséhez mintaadatokkal futtasd:

```bash
npm run build
npm run prisma:seed
```

### 7. Alkalmazás indítása

#### Fejlesztői mód

```bash
npm run start:dev
```

#### Éles mód

Fordítsd le a projektet, és indítsd el a szervert:

```bash
npm run build
npm run start:prod
```

Az alkalmazás elérhető lesz a `http://localhost:3000` címen.

## API Dokumentáció

Az API dokumentáció elérhető a gyökér URL-en (`http://localhost:3000`) Swagger használatával.

## Docker telepítés

Az alkalmazás Docker használatával történő telepítéséhez építsd meg és futtasd a Docker konténert:

```bash
docker build -t cat-cafe-backend .
docker run -p 3000:3000 --env-file .env cat-cafe-backend
```