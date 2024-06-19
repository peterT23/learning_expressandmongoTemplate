const mongoose = require("mongoose");
//create schema
const fooSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    flag: { type: Boolean, enum: [true, false], require: true },
  },
  {
    timestamps: true,
  }
);

// create and export model

const Foo = mongoose.model("Foo", fooSchema);
module.exports = Foo;
