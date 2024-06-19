const express = require("express");
const router = express.Router();
const {
  createBoo,
  getAllBoos,
  addReference,
} = require("../controllers/boo.controllers.js");

//Read
/**
 * @route GET api/boo
 * @description get list of boos
 * @access public
 */
router.get("/", getAllBoos);

//Create
/**
 * @route POST api/boo
 * @description create a boo
 * @access public
 */
router.post("/", createBoo);

//Update
/**
 * @route PUT api/boo
 * @description update reference to a boo
 * @access public
 */
router.put("/targetName", addReference);

//export

module.exports = router;
