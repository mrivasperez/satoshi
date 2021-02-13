const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    // call mineBlock
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1], // pass in last block from the chain
      data, // pass in new data
    });
    this.chain.push(newBlock); // push the new block to the chain
  }

  static isValidChain(chain) {
    // MAKE SURE CONTAINS GENESIS
    //stringify chain and compare it to the stringified genesis block
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    // HASH VALIDATION
    for (let i = 1; i < chain.length; i++) {
      // MAKE SURE ALL BLOCKS REFERENCE PREVIOUS BLOCKS HASHES CORRECTLY
      // pull preoperties of current block
      const { timestamp, lastHash, hash, data } = chain[i];
      // save the actual last hash for previous block
      const actualLastHash = chain[i - 1].hash;
      //check if last hash equals the hash of the previous block
      if (lastHash !== actualLastHash) return false;
      // CHECK IF CURRENT HASH IS VALID
      // generate a new hash using current fields
      const validatedHash = cryptoHash(timestamp, lastHash, data);
      // if the new hash is not the same as the expect hash, then it is an invalid hash
      if (hash !== validatedHash) return false;
    }

    // PASSED ALL TESTS!
    return true;
  }
}

module.exports = Blockchain;
