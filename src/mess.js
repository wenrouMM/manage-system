import {
  Message
} from 'element-ui'

const test = function (options) {
  options.duration = 2000
  options.showClose = true
  return Message(options)
}
const arr = ['success', 'warning', 'info', 'error']
arr.forEach(type => {
  test[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    options.type = type;
    options.duration = 2000
    options.showClose = true
    return Message(options);
  };
});

export default test

