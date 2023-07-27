const express = require("express");
const passport = require("passport");

const { User, Job, Bid } = require("../models");

const router = express.Router();

router.post(
  "/bids/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { amount, jobId, userId } = req.body;

    try {
      const job = await Job.findOne({
        where: {
          id: jobId,
        },
      });

      const user = await User.findOne({
        where: {
          uuid: userId,
        },
      });

      if (!job) {
        return res.status(400).json({ message: "Invalid job id." });
      }

      if (!user) {
        return res.status(400).json({ message: "Invalid user id." });
      }

      const bid = await Bid.create({
        amount,
        userId: user.id,
        jobId: job.id,
      });

      return res.json(bid);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

router.get(
  "/bids/get_all_job_bids",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { jobId } = req.query;

    try {
      const job = await Job.findOne({
        where: {
          id: jobId,
        },
      });

      if (!job) {
        return res.status(400).json({ message: "Invalid job id." });
      }

      const bids = await Bid.findAll({
        where: {
          jobId: job.id,
        },
        include: {
          model: User,
          as: "user",
        },
        order: [
          ["amount", "DESC"],
          ["createdAt", "DESC"],
        ],
      });

      return res.json(bids);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

module.exports = router;
