const Blockchain = require("./blockchain");
const Block = require("./block");

describe("Blockchain", () => {
  const blockchain = new Blockchain();

  test("contains a `chain` Array", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  test("starts with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  test("adds new block to the chain", () => {
    const newData = "foo bar";
    blockchain.addBlock({ data: newData });
    // make sure that the new block includes the new data
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });
});
