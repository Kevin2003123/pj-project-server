const User = {
  async images(parent, args, { knex }, info) {
    const images = await knex
      .select('id', 'user_id', 'name', 'image', 'createdAt')
      .from('images')
      .where('user_id', parent.id)
      .orderBy('createdAt', 'DESC');

    return images;
  }
};

module.exports = User;
