const handle = async (req, res, fn) => {
  const response = await fn(req, res);

  return res.status(response.code).send(response);
}

module.exports = handle;