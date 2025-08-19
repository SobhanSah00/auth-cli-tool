import { Request, Response } from "express";
import { User } from "../model/user.model.js";
import { comparePassword, hashPassword } from "../utils/hash.util.js";
import { generateJwtToken } from "../utils/jwt.util.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
     console.log("data : ",username,email,password);

    if (!username || !email || !password) {
      return res.status(401).json({
        message: "please give give all field.",
      })
    }

    const existingUser = await User.findOne({
      $or: [
        { email },
        { username }
      ]
    })

    if (existingUser) {
      return res.status(400).json({
        message: "user is already exist."
      })
    }

    console.log("data : ",username,email,password);


    const hashedPassword = await hashPassword(password)

    console.log("hassed passwor : ", hashPassword);

    const user = await User.create({ username, email, password: hashedPassword });

    if (!user) {
      return res.status(500).json({
        message: "any thing wrong happen while user is created ."
      })
    }

    const createdUser = {
      id : user._id,
      username: user.username,
      email: user.email
    }

    const token = generateJwtToken(createdUser);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User signed up successfully.",
      user,
      token,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = comparePassword(password, userFound.password)

    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const user = {
      id : userFound._id,
      username: userFound.username,
      email: userFound.email
    }

    const token = generateJwtToken(user);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User signed up successfully.",
      user,
      token,
    });
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    //   expiresIn: "1h",
    // });

    // res.json({ token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("jwt");
  res.json({
    message: "User log out ."
  })
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        message: "User is not authorized",
      });
    }

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const getUserInfo = {
      id: currentUser._id,
      username: currentUser.username, // check if your schema uses "username"
      email: currentUser.email,
    };

    return res.json(getUserInfo);
  } catch (err: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};