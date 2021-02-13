const cryptoHash = require("./crypto-hash");

describe("cryptoHash()", () => {
  // make sure a sha 256 is output
  test("generates a sha-256 hashed output", () => {
    expect(cryptoHash("foo")).toEqual(
      "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae"
    );
  });

  // make sure it produces the same hash given the same fields
  test("it produces the same hash with the same input arguments in any order", () => {
    expect(cryptoHash("one", "two", "three")).toEqual(
      cryptoHash("three", "two", "one")
    );
  });
});
