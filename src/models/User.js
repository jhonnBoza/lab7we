import mongoose from 'mongoose';

/** Validación de contraseña en texto plano (antes de bcrypt). Requisito de la tarea. */
export const PLAIN_PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@]).{8,}$/;

export function validatePlainPassword(password) {
  return PLAIN_PASSWORD_REGEX.test(password);
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  birthdate: {
    type: Date,
    required: true
  },
  url_profile: {
    type: String,
    trim: true,
    default: ''
  },
  adress: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
