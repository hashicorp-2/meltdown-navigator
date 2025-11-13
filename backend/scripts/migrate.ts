#!/usr/bin/env node
/**
 * Database migration script.
 * Run with: npm run migrate --workspace @meltdown/backend
 * 
 * This script handles database schema migrations and data migrations.
 * For now, it's a placeholder for future migration needs.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not set in environment variables.');
  process.exit(1);
}

async function runMigrations() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database.');

    // Example migration: Create indexes if they don't exist
    const { AiProfileModel } = await import('../src/models/AiProfile.js');
    
    console.log('Creating indexes...');
    await AiProfileModel.collection.createIndex({ userId: 1 }, { unique: true });
    await AiProfileModel.collection.createIndex({ createdAt: -1 });
    console.log('Indexes created successfully.');

    // Add more migrations here as needed
    // Example:
    // await migrateProfilesToNewSchema();

    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
}

// Run migrations
runMigrations();


