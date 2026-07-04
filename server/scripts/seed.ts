// Seed script — populates MongoDB with realistic feedback + one admin user.
//
// Run with: npm run seed  (from the /server directory)
//
// WARNING: This script is destructive. It deletes all existing feedback and
// users before seeding. Do not run against a production database that has
// real user data — only use it for initial setup or resetting a dev/demo DB.

import mongoose from 'mongoose';
import { env } from '../src/config/env';
import Feedback from '../src/models/Feedback';
import User from '../src/models/User';
import type { FeedbackCategory } from '../src/models/Feedback';

// Helper: returns a Date `daysAgo` days before now, with a random hour/minute
// so entries don't all cluster at midnight. Makes the seed data feel organic.
function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(Math.floor(Math.random() * 24));
  d.setMinutes(Math.floor(Math.random() * 60));
  return d;
}

type SeedFeedback = {
  name: string;
  email?: string;
  category: FeedbackCategory;
  message: string;
  createdAt: Date;
};

// 28 entries. Distribution:
//   Product ×7, Feature Request ×6, Support ×5, UI/UX ×5, Billing ×3, Other ×2
//   ~8 in last 7 days, ~12 in 7-30 days, ~8 in 30-60 days
//   22 with email, 6 without

const feedbackSeed: SeedFeedback[] = [
  // ---- Recent (last 7 days) ----
  { name: 'Priya Sharma', email: 'priya.s@example.com', category: 'Product', message: 'The dashboard loads noticeably faster than last month. Whatever you changed, keep doing it.', createdAt: daysAgo(1) },
  { name: 'Marcus Chen', email: 'marcus.chen@example.com', category: 'Feature Request', message: 'Would love the ability to export filtered feedback to CSV. Right now I have to screenshot the table.', createdAt: daysAgo(1) },
  { name: 'Ananya Iyer', email: 'ananya.iyer@example.com', category: 'Support', message: 'I tried resetting my password twice but never got the email. Ended up creating a second account.', createdAt: daysAgo(2) },
  { name: 'James O\'Brien', category: 'UI/UX', message: 'The category pills in the table are a nice touch — makes scanning much easier than plain text.', createdAt: daysAgo(3) },
  { name: 'Divya Menon', email: 'divya.m@example.com', category: 'Product', message: 'Overall very happy with the tool. It replaced two spreadsheets and a Slack channel for us.', createdAt: daysAgo(3) },
  { name: 'Tomás Ribeiro', email: 'tomas.r@example.com', category: 'Feature Request', message: 'Please add keyboard shortcuts for the dashboard. Even just / to focus search would be huge.', createdAt: daysAgo(4) },
  { name: 'Rohan Kapoor', email: 'rohan.k@example.com', category: 'UI/UX', message: 'The mobile layout works but the search bar is a bit cramped on smaller phones. Consider stacking it.', createdAt: daysAgo(5) },
  { name: 'Sofia Alvarez', email: 'sofia.a@example.com', category: 'Product', message: 'Been using this for two weeks and haven\'t hit a single bug. Refreshing after some other tools I could name.', createdAt: daysAgo(6) },

  // ---- Mid-range (7-30 days) ----
  { name: 'Karan Bhatia', email: 'karan.bhatia@example.com', category: 'Billing', message: 'My invoice shows a plan I don\'t recognize. Support ticket #4421 has been open a week with no reply.', createdAt: daysAgo(8) },
  { name: 'Emily Park', email: 'emily.park@example.com', category: 'Support', message: 'The onboarding docs skip a step between creating an account and inviting teammates. Confused me for a while.', createdAt: daysAgo(10) },
  { name: 'Neha Reddy', category: 'Feature Request', message: 'Dark mode. Please. My eyes at 11pm are begging.', createdAt: daysAgo(11) },
  { name: 'Aditya Rao', email: 'aditya.r@example.com', category: 'Product', message: 'Category distribution chart is genuinely useful. First thing I check every Monday morning.', createdAt: daysAgo(13) },
  { name: 'Wei Zhang', email: 'wei.zhang@example.com', category: 'UI/UX', message: 'The empty state when no feedback matches filters is well done — clear message and an obvious way out.', createdAt: daysAgo(15) },
  { name: 'Olivia Bennett', email: 'olivia.b@example.com', category: 'Support', message: 'Chat widget on your site doesn\'t work in Firefox. Had to open Chrome to reach anyone.', createdAt: daysAgo(17) },
  { name: 'Ishaan Malhotra', email: 'ishaan.m@example.com', category: 'Feature Request', message: 'Would be great to tag feedback with priority or link them to Jira tickets we\'re already tracking.', createdAt: daysAgo(19) },
  { name: 'Lakshmi Nair', email: 'lakshmi.n@example.com', category: 'Product', message: 'Small thing but the relative timestamps (\'2h ago\') are much nicer than raw dates. Good call.', createdAt: daysAgo(21) },
  { name: 'David Whitmore', category: 'Other', message: 'Just wanted to say thanks — a real person actually responded to my last message. Rare these days.', createdAt: daysAgo(23) },
  { name: 'Meera Sundaram', email: 'meera.s@example.com', category: 'UI/UX', message: 'The pie chart legend on desktop is clear, but the colors for Billing and Feature Request are hard to tell apart.', createdAt: daysAgo(25) },
  { name: 'Nikhil Joshi', email: 'nikhil.j@example.com', category: 'Feature Request', message: 'Bulk actions on the feedback table would save so much time. Even just \'mark multiple as read\'.', createdAt: daysAgo(27) },
  { name: 'Rachel Simmons', email: 'rachel.s@example.com', category: 'Billing', message: 'The pricing page could be clearer about what counts as an \'active user\'. Took me three reads.', createdAt: daysAgo(29) },

  // ---- Older (30-60 days) ----
  { name: 'Vikram Desai', email: 'vikram.d@example.com', category: 'Support', message: 'The API docs example for POST /feedback has a wrong content-type header. Cost me an afternoon.', createdAt: daysAgo(33) },
  { name: 'Chloe Martin', email: 'chloe.m@example.com', category: 'Product', message: 'Solid v1. Doesn\'t try to do everything, does the important things well. That\'s harder than it looks.', createdAt: daysAgo(37) },
  { name: 'Arjun Pillai', category: 'Feature Request', message: 'Email notifications when new feedback comes in for a specific category. Would let me stop checking manually.', createdAt: daysAgo(41) },
  { name: 'Hannah Green', email: 'hannah.g@example.com', category: 'UI/UX', message: 'The login page is clean but a \'forgot password\' link would help. I always forget on the first try.', createdAt: daysAgo(45) },
  { name: 'Sanjay Verma', email: 'sanjay.v@example.com', category: 'Support', message: 'Response time on tickets has improved a lot since Q1. Whoever hired more support staff, good move.', createdAt: daysAgo(49) },
  { name: 'Fatima Khan', category: 'Billing', message: 'Would prefer annual billing option. Monthly adds up and I know I\'m sticking with this.', createdAt: daysAgo(53) },
  { name: 'Liam O\'Connor', email: 'liam.oc@example.com', category: 'Other', message: 'The animation when filters clear is a bit slow. Not a blocker but felt worth mentioning.', createdAt: daysAgo(57) },
  { name: 'Ritika Agarwal', email: 'ritika.a@example.com', category: 'Product', message: 'Been recommending this to peer PMs. Simple enough to onboard non-technical teammates without a call.', createdAt: daysAgo(59) },
];

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(env.MONGODB_URI);
  console.log('✓ Connected');

  // ---- Wipe existing data ----
  const deletedFeedback = await Feedback.deleteMany({});
  console.log(`  Deleted ${deletedFeedback.deletedCount} existing feedback documents`);

  const deletedUsers = await User.deleteMany({});
  console.log(`  Deleted ${deletedUsers.deletedCount} existing users`);

  // ---- Insert feedback ----
  // NOTE: using `insertMany` skips Mongoose's default createdAt/updatedAt handling
  // for entries where we've set createdAt manually — but since our schema has
  // `{ timestamps: true }`, Mongoose will still auto-fill updatedAt.
  await Feedback.insertMany(feedbackSeed);
  console.log(`✓ Inserted ${feedbackSeed.length} feedback entries`);

  // ---- Create admin user ----
  // The User model's pre-save hook automatically bcrypt-hashes the password.
  // We use .create() (not .insertMany) specifically so the pre-save hook runs.
  await User.create({
    email: env.SEED_ADMIN_EMAIL,
    password: env.SEED_ADMIN_PASSWORD,
  });
  console.log(`✓ Created admin user: ${env.SEED_ADMIN_EMAIL}`);
  console.log('  (password not logged — check your .env file)');

  await mongoose.disconnect();
  console.log('\n✓ Seed complete. Database is ready.');
  process.exit(0);
}

seed().catch(async (err) => {
  console.error('\n✗ Seed failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
