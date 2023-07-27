const express = require("express");
const passport = require("passport");

const { User, Job } = require("../models");

const router = express.Router();

router.post(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { firstName, lastName, username, password } = req.body;

    try {
      const user = await User.create({
        firstName,
        lastName,
        username,
        password,
      });

      return res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const users = await User.findAll({
        include: [
          {
            model: Job,
            as: "jobs",
          },
        ],
      });

      return res.json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Something went wrong." });
    }
  }
);

router.get(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const username = req.params.username;

    try {
      const user = await User.findOne({
        where: {
          username,
        },
      });

      return res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Something went wrong." });
    }
  }
);

module.exports = router;
