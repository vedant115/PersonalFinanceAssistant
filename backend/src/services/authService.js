import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (userData) => {
  const { name, email, password } = userData;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  delete user.password;
  return user;
};

export const loginUser = async (userData) => {
  const { email, password } = userData;

  const user = await prisma.user.findUnique({ where: { email } });

  console.log(user);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  let matched = await bcrypt.compare(password, user.password);
  console.log(matched);
  if (!matched) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "yoursecret",
    { expiresIn: "1h" }
  );
  console.log(token);

  delete user.password;
  return { user, token };
};
