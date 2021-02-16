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

  static isValidChain = (chain) => {
    // MAKE SURE CONTAINS GENESIS
    //stringify chain and compare it to the stringified genesis block
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    // HASH VALIDATION
    for (let i = 1; i < chain.length; i++) {
      // MAKE SURE ALL BLOCKS REFERENCE PREVIOUS BLOCKS HASHES CORRECTLY
      // pull preoperties of current block
      const { timestamp, lastHash, hash, data, nonce, difficulty } = chain[i];
      // save the actual last hash for previous block
      const actualLastHash = chain[i - 1].hash;
      //check if last hash equals the hash of the previous block
      if (lastHash !== actualLastHash) return false;
      // CHECK IF CURRENT HASH IS VALID
      // generate a new hash using current fields
      const validatedHash = cryptoHash(
        timestamp,
        lastHash,
        data,
        nonce,
        difficulty
      );
      // if the new hash is not the same as the expect hash, then it is an invalid hash
      if (hash !== validatedHash) return false;
    }

    // PASSED ALL TESTS!
    return true;
  };

  replaceChain = (chain) => {
    // CHECK IF CHAIN IS LONGER THAN CURRENT CHAIN
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer.");
      return; // return if not longer
    }

    // CHECK IF CHAIN IS VALID
    if (!Blockchain.isValidChain(chain)) {
      console.error("The incoming chain must be valid.");
      return; // return if not valid
    }

    // IF CHAIN IS LONGER AND VALID, REPLACE THE CURRENT CHAIN
    console.log(`Replacing the current chain with:`, chain);
    this.chain = chain;
  };
}

module.exports = Blockchain;
