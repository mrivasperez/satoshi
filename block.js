const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

class Block {
  // constructor receive values within individual instances of the block - take in four arguments for unique args
  constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
    // set properties
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  // create the genesis block from genesis data
  static genesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    let hash, timestamp;
    // declare timestamp and lastHash prior to returning the minedBlock
    const lastHash = lastBlock.hash;
    // get difficulty from the last block
    const { difficulty } = lastBlock;
    // set nonce as dynamic
    let nonce = 0;

    // ensure the hash meets the difficulty criteria
    do {
      nonce++;
      timestamp = Date.now();
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty !== "0".repeat(difficulty)));

    //build new minedblock
    return new this({
      timestamp,
      lastHash,
      data,
      difficulty,
      nonce,
      hash,
    });
  }
}

module.exports = Block;
