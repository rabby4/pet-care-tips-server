import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import seedAdmin, { syncIndexes } from './app/DB';

async function main() {
  try {
    await mongoose.connect(config.database_uri as string);
    await seedAdmin().catch((error) =>
      console.error('Admin seeding failed:', error),
    );
    await syncIndexes();
    app.listen(config.path, () => {
      console.log(`Example app listening on port ${config.path}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

main();
