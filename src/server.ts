import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import seedSuperAdmin from './app/DB';

async function main() {
  try {
    await mongoose.connect(config.database_uri as string);
    seedSuperAdmin();
    app.listen(config.path, () => {
      console.log(`Example app listening on port ${config.path}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
