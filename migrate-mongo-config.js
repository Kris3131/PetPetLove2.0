require('dotenv').config();

const config = {
  mongodb: {
    url: process.env.MONGO_URL,
    databaseName: process.env.DATABASE_NAME,

    options: {
      ssl: true,
      retryWrites: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  lockCollectionName: 'changelog_lock',
  lockTtl: 0,
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;
