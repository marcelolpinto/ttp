function genResponse(status, data, details) {
  return {
    success: !!data,
    code: status.code,
    message: status.msg,
    err: !! data ? {
      code: status.code,
      msg: status.msg,
      toast: status.toast || false
    } : null,
    data
  };
}

module.exports = genResponse;