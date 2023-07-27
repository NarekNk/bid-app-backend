const express = require("express");
const jwt = require("jsonwebtoken");

const { User } = require("../models");
const { JWT_SECRET_KEY, JWT_REFRESH_KEY } = require("../utils/constants");
const { comparePasswords, hashPassword } = require("../utils/bcrypt");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  try {
    const alreadyExists = await User.findOne({ where: { username } });

    if (alreadyExists) {
      return res.status(403).json({
        message: `User with the username ${username} already exists.`,
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      firstName,
      lastName,
      username,
      password: hashedPassword,
    });

    return res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.headers);
  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const passwordMatch = await comparePasswords(password, user.password);

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Username or password does not match." });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: "60s",
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      JWT_REFRESH_KEY,
      {
        expiresIn: "1y",
      }
    );

    return res.json({
      message: "Logged in successfully!",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Invalid refresh token." });
    }

    jwt.verify(refreshToken, JWT_REFRESH_KEY, (err, payload) => {
      if (err) next(err);

      const userId = payload.id;

      const accessToken = jwt.sign(
        {
          id: userId,
        },
        JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );

      const refreshToken = jwt.sign(
        {
          id: userId,
        },
        JWT_REFRESH_KEY,
        {
          expiresIn: "1y",
        }
      );

      res.json({ accessToken, refreshToken });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
