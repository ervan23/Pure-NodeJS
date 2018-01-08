const valid = require('validator');

const validator = {
  data: null,
  error: [],
  message: '',
  error_message: [],
  notEmpty() {
    if (valid.isEmpty(validator.data)) {
      validator.error.push(true);
      validator.error_message.push(validator.message);
    }

    return validator;
  },
  isEmail() {
    if (!valid.isEmail(validator.data)) {
      validator.error.push(true);
      validator.error_message.push(validator.message);
    }

    return validator;
  },
  validate(data, errMsg) {
    validator.data = data;
    validator.message = errMsg;

    return validator;
  },
  fail() {
    const err = validator.error.length > 0;
    validator.error = [];
    return err;
  },
};

module.exports = validator;
