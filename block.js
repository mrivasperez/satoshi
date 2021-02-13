const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

class Block {
  // constructor receive values within individual instances of the block - take in four arguments for unique args
  constructor({ timestamp, lastHash, hash, data }) {
    // set properties
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  // create the genesis block from genesis data
  static genesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    // declare timestamp and lastHash prior to returning the minedBlock
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;

    //build new minedblock
    return new this({
      timestamp,
      lastHash,
      data,
      hash: cryptoHash(timestamp, lastHash, data),
    });
  }
}

module.exports = Block;