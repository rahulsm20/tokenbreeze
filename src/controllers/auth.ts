import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import bcrypt from "bcrypt";
import { jwtSecret } from "../utils/constants";
import jwt from "jsonwebtoken";

export const LoginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const matchesPassword = await bcrypt.compare(password, user.password);
    if (!matchesPassword) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: "24h",
    });
    res.cookie(process.env.SESSION_TOKEN_KEY || "token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.json({ message: "login succesful", token });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Failed to login", err: err.message });
  }
};

export const SignupController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const userExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (userExists) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    const matchesPassword = await bcrypt.compare(password, user.password);

    if (!matchesPassword) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: "24h",
    });
    res.cookie(process.env.SESSION_TOKEN_KEY || "token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return { message: "signup succesful", token };
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Failed to signup", err: err.message });
  }
};
