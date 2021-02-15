const Blockchain = require("./blockchain");
const Block = require("./block");

describe("Blockchain", () => {
  let blockchain, newChain, originaChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();

    originaChain = blockchain.chain;
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

  //   CHAIN REPLACEMENT
  describe("replaceChain", () => {
    let errorMock, logMock;
    beforeEach(() => {
      // quiet console logs in test
      errorMock = jest.fn();
      logMock = jest.fn();
      global.console.error = errorMock;
      global.console.log = logMock;
    });

    describe("when the new chain is not longer", () => {
      beforeEach(() => {
        newChain.chain[0] = { new: "chain" };
        blockchain.replaceChain(newChain.chain);
      });

      test("does not replace the chain", () => {
        expect(blockchain.chain).toEqual(originaChain);
      });

      test("logs an error", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "Bears" });
        newChain.addBlock({ data: "Beets" });
        newChain.addBlock({ data: "Berries" });
        newChain.addBlock({ data: "Battlestar Galactica" });
      });

      describe("the chain is invalid", () => {
        beforeEach(() => {
          newChain.chain[2].hash = "some-fake-hash";
          blockchain.replaceChain(newChain.chain);
        });

        test("does not replace the chain", () => {
          expect(blockchain.chain).toEqual(originaChain);
        });

        test("it logs an error", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("the chain is valid", () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
        });

        test("replaces the chain", () => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });

        test("it logs about the chain replacement", () => {
          expect(logMock).toHaveBeenCalled;
        });
      });
    });
  });
});
