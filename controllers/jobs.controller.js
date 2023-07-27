const express = require("express");
const passport = require("passport");

const { User, Job } = require("../models");

const router = express.Router();

router.post(
  "/jobs/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { title, description, userId } = req.body;

    try {
      const user = await User.findOne({
        where: {
          uuid: userId,
        },
      });

      const job = await Job.create({
        title,
        description,
        userId: user.id,
      });

      return res.json(job);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

router.get(
  "/jobs/get_all_jobs",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const jobs = await Job.findAll({
        include: [
          {
            model: User,
            as: "user",
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.json(jobs);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Something went wrong." });
    }
  }
);

router.get(
  "/jobs/get_Job_by_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.query;

    try {
      const jobs = await Job.findOne({
        where: {
          id,
        },
        include: [
          {
            model: User,
            as: "user",
          },
        ],
      });

      return res.json(jobs);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Something went wrong." });
    }
  }
);

router.get(
  "/jobs/get_all_jobs_by_user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { username } = req.query;
    try {
      const user = await User.findOne({
        where: {
          username,
        },
      });

      const jobs = await Job.findAll({
        where: {
          userId: user.id,
        },
        include: [
          {
            model: User,
            as: "user",
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.json(jobs);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Something went wrong." });
    }
  }
);

module.exports = router;
