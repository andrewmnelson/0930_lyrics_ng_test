module.exports = function(err, resp) {
  console.log(err);
  resp.status(500).json({msg: 'internal server error'});
};
