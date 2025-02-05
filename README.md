# Saas Monorepo

This monorepo contains both the frontend (React + Vite) and backend (NestJS) applications for the Saas project.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v8 or higher)
- PostgreSQL 14
- Redis
- icu4c (for Node.js internationalization support)

### System Setup (macOS)

1. Install required system libraries:

```bash
brew install icu4c@76
```

2. Add the following to your shell profile (~/.zshrc or ~/.bashrc):

```bash
export LDFLAGS="-L/usr/local/opt/icu4c@76/lib"
export CPPFLAGS="-I/usr/local/opt/icu4c@76/include"
export PKG_CONFIG_PATH="/usr/local/opt/icu4c@76/lib/pkgconfig"
```

3. Reload your shell profile:

```bash
source ~/.zshrc  # or source ~/.bashrc
```

### Database Setup

1. Install PostgreSQL and Redis (macOS):

```bash
brew install postgresql@14 redis
```

2. Start the services:

```bash
brew services start postgresql@14 && brew services start redis
```

3. Create PostgreSQL user and database:

```bash
# Create postgres superuser
createuser -s postgres

# Create the database
createdb -U postgres saas

# Set password for postgres user (when prompted, enter: postgres)
psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

4. Verify connection:

```bash
psql -U postgres -d saas -c "\l"
```

### Initial Setup

1. Create the database:

```sql
CREATE DATABASE saas;
```

2. Generate migration:

```bash
cd packages/backend && npx typeorm-ts-node-commonjs migration:generate src/migrations/InitialMigration -d src/config/data-source.ts
```

3. Run migration:

```bash
cd packages/backend && npx typeorm-ts-node-commonjs migration:run -d src/config/data-source.ts
```

### Useful Commands

#### Create a new migration

```bash
cd packages/backend && npx typeorm-ts-node-commonjs migration:generate src/migrations/[MigrationName] -d src/config/data-source.ts
```

#### Run pending migrations

```bash
cd packages/backend && npx typeorm-ts-node-commonjs migration:run -d src/config/data-source.ts
```

#### Revert last migration

```bash
cd packages/backend && npx typeorm-ts-node-commonjs migration:revert -d src/config/data-source.ts
```

### Database Access

You can access the database using:

1. **psql (CLI):**

```bash
psql -U postgres -d saas
```

2. **pgAdmin (GUI):**

- Install: `brew install --cask pgadmin4`
- Connect using:
  - Host: localhost
  - Port: 5432
  - Username: postgres
  - Password: postgres
  - Database: saas

3. **TablePlus (GUI Alternative):**

- Install: `brew install --cask tableplus`
- Connect using same credentials as above

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd saas
```

2. Install dependencies

```bash
# Install root dependencies and link workspaces
npm install
```

### Development

Before starting the development servers, ensure all services are running:

1. Check services status:

```bash
brew services list
```

2. Start services if needed:

```bash
brew services start postgresql@14 && brew services start redis
```

3. Start development servers:

```bash
# Start both frontend and backend
npm run dev

# Or run them separately:
# Frontend only (Vite + React)
npm run dev:frontend

# Backend only (NestJS)
npm run dev:backend
```

### Access Applications

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
saas/
├── packages/
│   ├── frontend/             # React application with Vite
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── assets/
│   │   │   └── styles/
│   │   └── ...
│   └── backend/             # NestJS application
│       ├── src/
│       │   ├── controllers/
│       │   ├── services/
│       │   └── modules/
│       └── ...
└── shared/                  # Shared code between frontend and backend
    └── src/
        └── types/
```

## 🛠 Available Scripts

### Root Directory

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only
- `npm run build` - Build all packages
- `npm run test` - Run tests across all packages

### Frontend Package

- `npm run dev -w packages/frontend` - Start development server
- `npm run build -w packages/frontend` - Build for production
- `npm run preview -w packages/frontend` - Preview production build
- `npm run lint -w packages/frontend` - Lint code

### Backend Package

- `npm run start:dev -w packages/backend` - Start development server
- `npm run build -w packages/backend` - Build for production
- `npm run start:prod -w packages/backend` - Start production server
- `npm run test -w packages/backend` - Run tests
- `npm run lint -w packages/backend` - Lint code

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run frontend tests
npm run test -w packages/frontend

# Run backend tests
npm run test -w packages/backend
```

## 📦 Building for Production

Build all packages:

```bash
npm run build
```

## 🔧 Environment Variables

### Frontend (.env)

```
VITE_API_URL=http://localhost:3000
```

### Backend (.env)

```
PORT=3000
DATABASE_URL=your_database_url
```

## 🤝 Contributing

1. Create a new branch

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit

```bash
git commit -m "feat: add new feature"
```

3. Push to your branch

```bash
git push origin feature/your-feature-name
```

4. Open a Pull Request

## 📝 Code Style Guide

- Frontend follows the React + TypeScript best practices
- Backend follows the NestJS style guide
- Use ESLint and Prettier for code formatting
- Follow conventional commits for commit messages

## 🐛 Troubleshooting

### Common Issues

1. **Node.js icu4c Error**

   If you encounter an error about `libicui18n.74.dylib`, try reinstalling Node.js:

   ```bash
   brew uninstall node
   brew install node
   ```

2. **Module not found errors**

   - Try removing all node_modules and reinstalling:

   ```

   ```

### Database Migrations

#### Creating a New Migration

1. **Automatic Migration Generation** (recommended)
   After making changes to your entities, generate a migration automatically:

   ```bash
   cd packages/backend && npx typeorm-ts-node-commonjs migration:generate src/migrations/[MigrationName] -d src/config/data-source.ts
   ```

   Example:

   ```bash
   cd packages/backend && npx typeorm-ts-node-commonjs migration:generate src/migrations/AddUserProfile -d src/config/data-source.ts
   ```

2. **Create Empty Migration**
   If you need to write a migration manually:
   ```bash
   cd packages/backend && npx typeorm-ts-node-commonjs migration:create src/migrations/[MigrationName]
   ```
   Example:
   ```bash
   cd packages/backend && npx typeorm-ts-node-commonjs migration:create src/migrations/AddUserCustomFields
   ```

#### Managing Migrations

1. **Check Migration Status**

   ```bash
   cd packages/backend && npx typeorm-ts-node-commonjs migration:show -d src/config/data-source.ts
   ```

2. **Run Pending Migrations**

   ```bash
   cd packages/backend && npx typeorm-ts-node-commonjs migration:run -d src/config/data-source.ts
   ```

3. **Revert Last Migration**
   ```bash
   cd packages/backend && npx typeorm-ts-node-commonjs migration:revert -d src/config/data-source.ts
   ```

#### Migration Best Practices

1. **Naming Conventions**

   - Use descriptive names: `AddUserProfileColumn`, `CreateOrdersTable`
   - Use timestamp prefixes (automatically added)
   - Use PascalCase for migration names

2. **Writing Safe Migrations**

   - Always include both `up()` and `down()` methods
   - Test migrations in development before applying to production
   - Back up your database before running migrations in production
   - Make migrations idempotent when possible

3. **Example Migration**

   ```typescript
   import { MigrationInterface, QueryRunner, Table } from "typeorm";

   export class CreateUserProfileTable1234567890 implements MigrationInterface {
     public async up(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.createTable(
         new Table({
           name: "user_profile",
           columns: [
             {
               name: "id",
               type: "uuid",
               isPrimary: true,
               generationStrategy: "uuid",
               default: "uuid_generate_v4()",
             },
             {
               name: "user_id",
               type: "uuid",
             },
             {
               name: "bio",
               type: "text",
               isNullable: true,
             },
             {
               name: "created_at",
               type: "timestamp",
               default: "now()",
             },
           ],
           foreignKeys: [
             {
               columnNames: ["user_id"],
               referencedTableName: "users",
               referencedColumnNames: ["id"],
               onDelete: "CASCADE",
             },
           ],
         }),
         true
       );
     }

     public async down(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.dropTable("user_profile");
     }
   }
   ```

4. **Common Migration Operations**

   ```typescript
   // Add column
   await queryRunner.addColumn(
     "table_name",
     new TableColumn({
       name: "column_name",
       type: "varchar",
     })
   );

   // Remove column
   await queryRunner.dropColumn("table_name", "column_name");

   // Add index
   await queryRunner.createIndex(
     "table_name",
     new TableIndex({
       name: "index_name",
       columnNames: ["column_name"],
     })
   );

   // Add foreign key
   await queryRunner.createForeignKey(
     "table_name",
     new TableForeignKey({
       columnNames: ["foreign_id"],
       referencedTableName: "referenced_table",
       referencedColumnNames: ["id"],
       onDelete: "CASCADE",
     })
   );
   ```
