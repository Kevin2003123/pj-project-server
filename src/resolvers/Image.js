const Image = {
  async author(parent, args, { knex }, info) {
    const [author] = await knex
      .select('id', 'name', 'email', 'avatar', 'createdAt')
      .from('users')
      .where('id', parent.user_id);
    return author;
  }
};

module.exports = Image;
