const Blockchain = require("./blockchain");
const Block = require("./block");

describe("Blockchain", () => {
  let blockchain = new Blockchain();

  beforeEach(() => {
    blockchain = new Blockchain();
  });

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

  // Chain validator
  describe("isValidChain()", () => {
    describe("when the chain does not start with the genesis block", () => {
      beforeEach(() => {
        blockchain = new Blockchain();
      });

      test("returns false", () => {
        blockchain.chain[0] = { data: "fake-genesis" };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("when the chain does start with the genesis block and has multiple blocks", () => {
      describe("a last hash reference has changed", () => {
        beforeEach(() => {
          blockchain.addBlock({ data: "Bears" });
          blockchain.addBlock({ data: "Beets" });
          blockchain.addBlock({ data: "Berries" });
        });

        test("returns false", () => {
          blockchain.chain[2].lastHash = "broken-lastHash";

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });

        describe("the chain contains a block with an invalid field", () => {
          test("returns false", () => {
            //modify chain field
            blockchain.chain[2].data = "some-bad-and-evil-data";

            expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
          });
        });

        describe("the chain does not contain any invalid blocks", () => {
          test("returns true", () => {
            expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
          });
        });
      });
    });
  });
});
