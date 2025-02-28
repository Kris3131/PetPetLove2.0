module.exports = {
  async up(db) {
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['username', 'email', 'password', 'role'],
          properties: {
            username: { bsonType: 'string' },
            email: {
              bsonType: 'string',
              pattern: '^.+@.+$',
            },
            password: { bsonType: 'string' },
            role: {
              bsonType: 'string',
              enum: ['user', 'admin'],
            },
            followers: {
              bsonType: 'array',
              items: { bsonType: 'objectId' },
            },
            following: {
              bsonType: 'array',
              items: { bsonType: 'objectId' },
            },
            blockedUsers: {
              bsonType: 'array',
              items: { bsonType: 'objectId' },
            },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });

    await db.collection('users').createIndex({ email: 1 }, { unique: true });

    console.log('[migrate-mongo] users Collection has been created');
  },

  async down(db) {
    await db.collection('users').drop();
    console.log('[migrate-mongo] users Collection has been dropped');
  },
};
