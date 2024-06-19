var express = require("express");
var router = express.Router();
const { sendResponse, AppError } = require("../helpers/utils.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("welcome to coderSchool");
});

router.get("/template/:test", async (req, res, next) => {
  const { test } = req.params;

  try {
    // turn on to test error handling

    if ((test = error)) {
      throw new AppError(401, "Access denied", "Authentication Error");
    } else {
      sendResponse(
        res,
        200,
        true,
        { data: "template" },
        null,
        "template success"
      );
    }
  } catch (error) {
    next(error);
  }
});

const fooRouter = require("./foo.api.js");
router.use("/foo", fooRouter);

const booRouter = require("./boo.api.js");
router.use("/boo", booRouter);

module.exports = router;
