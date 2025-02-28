module.exports = {
  async up(db) {
    await db.createCollection('blocks', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['blocker', 'blocked'],
          properties: {
            blocker: { bsonType: 'objectId', description: '封鎖者 ID' },
            blocked: { bsonType: 'objectId', description: '被封鎖者 ID' },
            createdAt: { bsonType: 'date' },
          },
        },
      },
    });

    await db
      .collection('blocks')
      .createIndex({ blocker: 1, blocked: 1 }, { unique: true });

    console.log('[migrate-mongo] create blocks Collection');
  },

  async down(db) {
    await db.collection('blocks').drop();
    console.log('[migrate-mongo] drop blocks Collection');
  },
};
