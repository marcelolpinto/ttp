function genResponse(status, data, details) {
  return {
    success: !!data,
    status: {
      code: status.code,
      msg: status.msg,
      details
    },
    data
  };
}

module.exports = genResponse;