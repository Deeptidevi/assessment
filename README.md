# AasaMedChem Inventory and Order Management System

A full-stack web application built for the AasaMedChem recruitment process to manage inventory and order quotations.

## Live Deployment (Vercel)

*To the user: Once you deploy this to Vercel, put the live URL here.*

## Tech Stack
- **Framework**: Next.js 15 (App Router, Server Actions, TypeScript)
- **Database**: Neon PostgreSQL
- **Database Driver**: `pg` (Raw SQL queries)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js (Auth.js) v5

## Core System Architecture & Decisions

### 1. Raw SQL over ORM
To keep the application as robust, transparent, and fundamental as possible, **no ORM was used**. Instead, raw SQL queries are written using the standard `pg` driver. This perfectly aligns with the requirement to use a Neon-hosted PostgreSQL database and demonstrates a deep understanding of core data modeling, relationships (`JOIN`s, `json_agg`), and transactions (`BEGIN`...`COMMIT`).

### 2. Unit Storage and Conversion Strategy
A major challenge with building inventory systems is floating-point inaccuracies and unit-conversion bugs. To handle this:

- **Storage**: All products are stored strictly in their **Base Unit** in the database.
  - Weight is stored in `GRAM`.
  - Volume is stored in `MILLILITER`.
  - Count items are stored in `COUNT`.
- **Database Precision**: We use PostgreSQL `DECIMAL(16, 4)` for both prices and quantities. This completely prevents the classic JavaScript floating point errors (e.g. 0.1 + 0.2 = 0.30000000000000004) and allows for high-precision calculations and very large stock values.
- **Conversions**: Conversions are performed dynamically on the application level before saving an order.
  - If a user views a product priced at 10 INR / Gram and selects "2 Kilograms" to order, the app calculates `2 * 1000 = 2000 grams`. It then sets the total quotation to `2000 * 10 = 20,000 INR`.
  - The requested quantity (2) and unit (KG) are stored on the `order_items` for display purposes, but the internally calculated `calculated_price` is strictly enforced.

### 3. High-Level System Design
- **Frontend/Backend**: Since we use Next.js App Router, the boundaries between client and server are seamless. We use `React Server Components` for heavily loading data directly from PostgreSQL using parameterized SQL queries.
- **Server Actions**: Form submissions (like creating an order or a new product) invoke Server Actions (`"use server"`). These actions run securely on the Node.js backend, perform validation, execute `INSERT` queries, and trigger cache revalidation via `revalidatePath`.

### 4. Database Schema Overview
- `users`: Handles authentication. Contains `role` column (`ADMIN`, `SELLER`).
- `products`: Stores product details. Contains `base_unit` (`GRAM`, `MILLILITER`, `COUNT`), `base_price_per_unit`, and `stock_quantity`.
- `orders`: Represents a quotation/order. Contains `seller_id`, `total_amount`, and `status`.
- `order_items`: Connects to `orders` and `products`. Stores `requested_quantity` (e.g. 2.5), `requested_unit` (e.g. "KG"), and `calculated_price`.

## How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your-neon-postgres-connection-string"
   AUTH_SECRET="your-nextauth-secret-string"
   ```

3. **Initialize Database Tables**:
   Since we don't use an ORM, you can trigger the table creation script by starting the server and making a GET request to the setup route:
   ```bash
   npm run dev
   ```
   Then navigate to `http://localhost:3000/api/setup` in your browser. This will automatically run the `CREATE TABLE IF NOT EXISTS` queries in your Neon DB.

## Test Credentials

No manual seeding is needed! Just log in with the credentials below, and the system will automatically create the initial accounts securely in the DB if they do not exist:

- **Admin Portal**:
  - Email: `admin@example.com`
  - Password: `admin123`
- **Customer / Seller Portal**:
  - Email: `user@example.com`
  - Password: `user123`

## Vercel Deployment Instructions

1. Push this repository to GitHub.
2. Go to Vercel and import the repository.
3. In the Vercel deployment settings, add the `DATABASE_URL` and `AUTH_SECRET` environment variables.
4. Click **Deploy**.

## UI / UX Philosophy
The UI was built with Tailwind CSS to ensure it looks modern, "human", and highly professional. Custom hover states, distinct color palettes for Admin (grayscale/blue) vs Seller (blue/green accents), and a robust dashboard layout were implemented instead of relying on generic template libraries.
