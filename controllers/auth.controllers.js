import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    //HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    //CREATE A NEW USER AND SAVE IT TO DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    console.log(newUser);
    res.status(201).json({ message: "user created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed to create user" });
  }
};
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    //checkif user exist or not
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ message: "invalid credentials" });
    //check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "invalid credentials" });
    //generate cookie token and send it to user
    const age = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign(
      { id: user.id, isAdmin: true },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: age,
      }
    );
    const { password: userPassword, ...userinfo } = user;
    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true,
        maxAge: age,
      })
      .status(200)
      .json(userinfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed to login" });
  }

  //db operations
};
export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "logout successfully" });
  //db operations
};
