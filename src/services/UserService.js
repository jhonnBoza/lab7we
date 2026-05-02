import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import { validatePlainPassword } from '../models/User.js';

function computeAge(birthdate) {
  if (!birthdate) return null;
  const d = new Date(birthdate);
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

function toPublicUser(user) {
  if (!user) return null;
  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    birthdate: user.birthdate,
    age: computeAge(user.birthdate),
    url_profile: user.url_profile,
    adress: user.adress,
    roles: user.roles.map(r => r.name),
    createdAt: user.createdAt
  };
}

class UserService {
  async getAll() {
    const users = await userRepository.getAll();
    return users.map(u => toPublicUser(u));
  }

  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      const err = new Error('Usuario no encontrado');
      err.status = 404;
      throw err;
    }
    return toPublicUser(user);
  }

  async updateProfile(userId, body) {
    const allowed = ['name', 'lastName', 'phoneNumber', 'birthdate', 'url_profile', 'adress', 'email'];
    const data = {};

    for (const key of allowed) {
      if (body[key] === undefined || body[key] === null) continue;
      if (key === 'url_profile' || key === 'adress') {
        data[key] = typeof body[key] === 'string' ? body[key].trim() : body[key];
        continue;
      }
      if (body[key] === '') continue;
      if (key === 'birthdate') data[key] = new Date(body[key]);
      else data[key] = typeof body[key] === 'string' ? body[key].trim() : body[key];
    }

    if (body.password && String(body.password).trim()) {
      if (!validatePlainPassword(body.password)) {
        const err = new Error(
          'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un dígito y un carácter especial (# $ % & * @)'
        );
        err.status = 400;
        throw err;
      }
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
      data.password = await bcrypt.hash(body.password, saltRounds);
    }

    const updated = await userRepository.updateById(userId, data);
    if (!updated) {
      const err = new Error('Usuario no encontrado');
      err.status = 404;
      throw err;
    }
    return toPublicUser(updated);
  }
}

export default new UserService();
