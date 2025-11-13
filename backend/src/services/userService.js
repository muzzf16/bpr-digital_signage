// backend/src/services/userService.js
import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository.js';

const saltRounds = 10;

const userService = {
  async createUser(userData) {
    const { username, email, password, role } = userData;
    const password_hash = await bcrypt.hash(password, saltRounds);
    return userRepository.createUser({ username, email, password_hash, role });
  },

  async verifyUser(username, password) {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      return null;
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return null;
    }

    return user;
  },

  async findByUsername(username) {
    return userRepository.findByUsername(username);
  },

  async findById(id) {
    return userRepository.findById(id);
  },

  async update(id, userData) {
    return userRepository.update(id, userData);
  },
};

export default userService;
