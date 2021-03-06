const generateToken = require('../utils/generateToken.js');
const getUserId = require('../utils/getUserld');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutation = {
  async createUser(parent, { data }, { knex }, info) {
    if (!data.name || !data.password || !data.email) {
      throw new Error('Please fill all the fields');
    }

    const [uniqueEmail] = await knex
      .select('email')
      .from('users')
      .where('email', data.email);

    if (uniqueEmail) {
      throw new Error('Email already exist');
    }

    if (data.password !== data.verifyPassword) {
      throw new Error('Password not match');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(data.password, salt);

    const createUser = {
      name: data.name,
      email: data.email,
      password: hashPassword
    };

    await knex('users').insert(createUser);

    const [result] = await knex
      .select('id', 'name', 'email', 'avatar', 'createdAt')
      .from('users')
      .where('email', data.email);

    result.token = generateToken(result.id);
    return result;
  },

  async createImage(parent, { data }, { knex, request }, info) {
    const user_id = getUserId(request);

    const createImage = {
      name: data.name,
      description: data.description,
      src: data.src,
      user_id
    };

    await knex('images').insert(createImage);

    const [image] = await knex
      .select('id', 'user_id', 'name', 'src', 'description', 'createdAt')
      .from('images')
      .where('user_id', user_id)
      .orderBy('createdAt', 'DESC')
      .limit(1);

    return image;
  },

  async login(parent, { email, password }, { knex }, info) {
    const [user] = await knex
      .select('id', 'name', 'email', 'password')
      .from('users')
      .where('email', email);
    if (!user) {
      throw new Error('Unable to login');
    }

    const validatePassword = bcrypt.compareSync(password, user.password);

    if (!validatePassword) {
      throw new Error('Unable to login');
    }

    user.token = generateToken(user.id);

    return user;
  },

  async auth(parent, { token }, { knex }, info) {
    const decoded = jwt.verify(token, 'thisisasecret');

    const [user] = await knex
      .select('id', 'name', 'avatar', 'email')
      .from('users')
      .where('id', decoded.userId);

    return user;
  },

  async updateAvatar(parent, { avatar }, { request, knex }, info) {
    if (!avatar) {
      throw new Error('unable to upload');
    }
    const user_id = getUserId(request);

    const updatedImage = await knex('users')
      .where('id', user_id)
      .update('avatar', avatar);
    console.log(updatedImage);

    return avatar;
  },

  async updateUser(parent, { data }, { request, knex }, info) {
    const user_id = getUserId(request);
    let value = {};
    let res = { success: { name: '', email: '', password: '' } };
    if (data.name) {
      value.name = 'name';
      value.value = data.name;
      res.success.name = 'Name changed';
    }

    if (data.email) {
      value.name = 'email';
      value.value = data.email;
      res.success.email = 'Email changed';
    }

    if (data.password) {
      value.name = 'password';
      value.value = data.password;
      res.success.password = 'Password changed';
    }

    if (!data.name && !data.password && !data.email) {
      throw new Error('Introduce a valid data');
    }

    const update_user = await knex('users')
      .where('id', user_id)
      .update(value.name, value.value);

    const [user] = await knex
      .select('id', 'name', 'email', 'avatar')
      .from('users')
      .where('id', user_id);
    return { ...res, ...user };
  }
};
module.exports = Mutation;
