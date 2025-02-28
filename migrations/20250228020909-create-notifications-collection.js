module.exports = {
  async up(db) {
    await db.createCollection('notifications', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['receiver', 'type', 'initiator'],
          properties: {
            receiver: { bsonType: 'objectId' },
            initiator: { bsonType: 'objectId' },
            type: {
              bsonType: 'string',
              enum: ['follow', 'like', 'comment'],
            },
            relatedId: { bsonType: 'objectId' },
            isRead: { bsonType: 'bool' },
            createdAt: { bsonType: 'date' },
          },
        },
      },
    });

    await db
      .collection('notifications')
      .createIndex({ receiver: 1, isRead: 1 });
  },

  async down(db) {
    await db.collection('notifications').drop();
  },
};
