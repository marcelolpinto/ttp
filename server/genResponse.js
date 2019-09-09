function genResponse(status, data, details) {
  return {
    success: !!data,
    code: status.code,
    defaultMsg: status.default,
    err: !data ? {
      code: status.code,
      msg: status.msg,
      toast: status.toast || false
    } : null,
    data,
    ...details
  };
}

module.exports = genResponse;