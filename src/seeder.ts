import { QueryResult, Pool } from 'pg';

export async function seeder(db: Pool) {
  try {
    await db.query(
      'create table users(id SERIAL PRIMARY KEY, email TEXT UNIQUE, username TEXT UNIQUE, full_name TEXT, password TEXT, phone_number TEXT, location TEXT, gender TEXT, following TEXT[], follower TEXT[], avatar TEXT)',
    );
  } catch (ignore) {}
  try {
    await db.query(
      'CREATE TABLE posts(id SERIAL PRIMARY KEY, user_id SERIAL REFERENCES users(id), item_name TEXT NOT NULL, buy_date DATE, exp_date DATE, category TEXT, description TEXT, tag TEXT NOT NULL, timestamp bigint, image TEXT)',
    );
  } catch (ignore) {}
  try {
    await db.query(
      'CREATE TABLE requests(id SERIAL PRIMARY KEY, user_id SERIAL REFERENCES users(id), requester_id SERIAL REFERENCES users(id), post_id SERIAL REFERENCES posts(id))',
    );
  } catch (ignore) {}
  try {
    await db.query(
      'CREATE TABLE chats(id SERIAL PRIMARY KEY, user_id SERIAL REFERENCES users(id), receiver_id SERIAL REFERENCES users(id), timestamp bigint, message text)',
    );
  } catch (ignore) {}
}
