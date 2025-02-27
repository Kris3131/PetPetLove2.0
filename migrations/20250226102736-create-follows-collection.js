module.exports = {
  async up(db) {
    await db.createCollection('follows', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['follower', 'following'],
          properties: {
            follower: { bsonType: 'objectId' },
            following: { bsonType: 'objectId' },
            createdAt: { bsonType: 'date' },
          },
        },
      },
    });

    await db
      .collection('follows')
      .createIndex({ follower: 1, following: 1 }, { unique: true });

    console.log('[migrate-mongo] follows Collection has been created');
  },

  async down(db) {
    await db.collection('follows').drop();
    console.log('[migrate-mongo] follows Collection has been dropped');
  },
};
