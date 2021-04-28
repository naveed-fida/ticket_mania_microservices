import mongoose from 'mongoose';
import { Password } from "../lib/password";

// interface to describe the required attrs to create a user
interface UserAttrs {
  email: string;
  password: string;
}

// interface to describe what user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// interface to describe what a user instance has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(_, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
    }
  },
  versionKey: false
});

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashedPass = await Password.hash(this.get('password'));
    this.set('password', hashedPass);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}

export const User = mongoose.model<UserDoc, UserModel>('User', userSchema);