const express = require("express");

const jobsApi = require("./jobs.controller");
const usersApi = require("./users.controller");
const bidsApi = require("./bids.controller");
const authApi = require("./auth.controller");

const router = express.Router();

router.use(jobsApi);
router.use(usersApi);
router.use(bidsApi);
router.use(authApi);

module.exports = router;
