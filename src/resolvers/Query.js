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
      page = page * 3 - 3;
    }
    console.log(search);
    if (!search) {
      search = '';
    }
    const res = {};
    const searchImage = await knex('images')
      .join('users', 'users.id', '=', 'images.user_id')
      .select(
        'images.id',
        'images.user_id',
        'images.name',
        'images.src',
        'images.createdAt',
        'users.name as userName',
        'users.avatar'
      )

      .orderBy('images.createdAt', 'DESC')
      .where('images.name', 'like', `%${search}%`)
      .limit(3)
      .offset(page);
    res.images = searchImage;
    const [lastImage] = await knex('images')
      .select('id')
      .orderBy('createdAt')
      .where('name', 'like', `%${search}%`)
      .limit(1);
    if (lastImage) {
      res.lastImage = lastImage.id;
    } else {
      res.lastImage = null;
    }
    console.log(res);
    return res;
  },

  async image(parent, { id }, { knex }, info) {
    const [image] = await knex
      .select('id', 'user_id', 'name', 'src', 'createdAt')
      .from('images')
      .where('id', id);

    return image;
  }
};

module.exports = Query;
