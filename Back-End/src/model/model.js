const mongoose = require("mongoose");
const validator = require('validator');


const resSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: 'Invalid email format'
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 4
    },
    confirmpassword: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: 'Password does not match'
      }
    }
  });
  

const REGISTRATIONCollection = mongoose.model("REGISTARTIONCollection", resSchema);
module.exports = REGISTRATIONCollection;
