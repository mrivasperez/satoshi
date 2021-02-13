const Block = require("./block");

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
}

module.exports = Blockchain;
