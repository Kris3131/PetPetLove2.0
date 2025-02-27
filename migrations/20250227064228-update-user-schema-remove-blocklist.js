module.exports = {
  async up(db) {
    await db.collection('user').updateMany({}, { $unset: { blockList: '' } });
    console.log('[migrate-mongo] remove blockList from user Collection');
  },

  async down(db) {
    await db.collection('user').updateMany({}, { $set: { blockList: [] } });
    console.log('[migrate-mongo] add blockList to user Collection');
  },
};
