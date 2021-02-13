const Block = require("./block");
const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

describe("Block", () => {
  const timestamp = "a-date";
  const lastHash = "foo-hash";
  const hash = "bar-hash";
  const data = ["blockchain", "data"];
  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
  });

  test("has a timestamp, lasthash, hash, and data property", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });
  // overall blocktest
  describe("genesis()", () => {
    const genesisBlock = Block.genesis();
    console.log("genesisBlock", genesisBlock);
    test("returns a Block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    test("returns the genesis block", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe("mineBlock", () => {
    // last block
    const lastBlock = Block.genesis();
    const data = "mined data";
    // create minedblock constant
    const minedBlock = Block.mineBlock({ lastBlock, data });

    test("returns a Block instance", () => {
      expect(minedBlock instanceof Block).toBe(true);
    });
    test("sets the `lastHast` to be the `hash` of the lastBlock", () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });
    test("sets the `data`", () => {
      expect(minedBlock.data).toEqual(data);
    });
    test("sets a `timestamp`", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });
    test("creates a sha-256 ``hash based on the proper inputs", () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(minedBlock.timestamp, lastBlock.hash, data)
      );
    });
  });
});
