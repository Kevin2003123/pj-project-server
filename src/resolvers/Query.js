const Query = {
  async users(parent, args, { knex }, info) {
    const users = await knex
      .select('name', 'email', 'avatar', 'createdAt')
      .from('users');
    return users;
  },

  async images(parent, { search, page }, { knex }, info) {
    if (!page) {
      page = 0;
    } else {
      page = page * 5 - 5;
    }
    console.log(search);
    if (!search) {
      search = '';
    }

    const searchImage = await knex
      .select('id', 'user_id', 'name', 'image', 'createdAt')
      .from('images')
      .orderBy('createdAt', 'DESC')
      .where('name', 'like', `%${search}%`)
      .limit(5)
      .offset(page);
    return searchImage;
  },

  async image(parent, { id }, { knex }, info) {
    const [image] = await knex
      .select('id', 'user_id', 'name', 'image', 'createdAt')
      .from('images')
      .where('id', id);

    return image;
  }
};

module.exports = Query;
