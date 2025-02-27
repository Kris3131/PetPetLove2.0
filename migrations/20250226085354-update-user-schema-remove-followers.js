module.exports = {
  async up(db) {
    await db
      .collection('user')
      .updateMany({}, { $unset: { followers: '', following: '' } });
    console.log(
      '[migrate-mongo] remove followers & following from users Collection'
    );
  },

  async down(db) {
    await db
      .collection('user')
      .updateMany({}, { $set: { followers: [], following: [] } });
    console.log(
      '[migrate-mongo] restore followers & following to users Collection'
    );
  },
};
