import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables
config();

// Create the connection
const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  try {
    console.log('🚀 Starting database migration...');

    // Create tables in order
    console.log('📋 Creating users table...');
    await sql`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT,
      avatar TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`;

    console.log('💬 Creating chat_sessions table...');
    await sql`CREATE TABLE IF NOT EXISTS chat_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT REFERENCES users(id) NOT NULL,
      title TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`;

    console.log('💬 Creating messages table...');
    await sql`CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id UUID REFERENCES chat_sessions(id) NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      attachments JSONB,
      timestamp TIMESTAMP DEFAULT NOW()
    )`;

    console.log('🔍 Creating search_history table...');
    await sql`CREATE TABLE IF NOT EXISTS search_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT REFERENCES users(id) NOT NULL,
      query TEXT NOT NULL,
      document_name TEXT,
      timestamp TIMESTAMP DEFAULT NOW()
    )`;

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();