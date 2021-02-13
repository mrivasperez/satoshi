const crypto = require("crypto");

const cryptoHash = (...inputs) => {
  const hash = crypto.createHash("sha256");
  // sort all inputs so that that hash is the same no matter what way the inputs are made
  hash.update(inputs.sort().join(""));
  return hash.digest("hex");
};

module.exports = cryptoHash;
