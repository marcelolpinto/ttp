function genResponse(status, data, details) {
  return {
    success: !!data,
    code: status.code,
    message: status.msg,
    err: {
      code: status.code,
      msg: status.msg,
      toast: status.toast || false
    },
    data
  };
}

module.exports = genResponse;