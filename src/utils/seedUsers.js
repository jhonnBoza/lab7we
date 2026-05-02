import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

export default async function seedUsers() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@lab.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin#12345';

  const existing = await userRepository.findByEmail(adminEmail);
  if (existing) return;

  let adminRole = await roleRepository.findByName('admin');
  if (!adminRole) adminRole = await roleRepository.create({ name: 'admin' });

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
  const hashed = await bcrypt.hash(adminPassword, saltRounds);

  await userRepository.create({
    email: adminEmail,
    password: hashed,
    name: 'Admin',
    lastName: 'Sistema',
    phoneNumber: '000000000',
    birthdate: new Date('1990-01-01'),
    roles: [adminRole._id],
    url_profile: '',
    adress: ''
  });

  console.log(`Usuario admin seed: ${adminEmail}`);
}
