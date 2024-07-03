let Strategy = require("../lib/strategy");

let validCryptrConfig = {
  base_url: "http://localhost:4000",
  audiences: ["http://localhost:3001"],
  tenants: ["cryptr-cryptr"],
  client_ids: ['f407cafd-b58a-472f-b857-475a863b69b6']
};

let otherTenantToken =
  "eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC90L21pc2FwcmV0Iiwia2lkIjoiYWIwYWZmZDgtZDM0Zi00YjMwLWIwNGEtYzMzN2E2ZjNmNjBjIiwidHlwIjoiSldUIn0.eyJhcHBsaWNhdGlvbl9tZXRhZGF0YSI6e30sImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCIsImNpZCI6ImY0MDdjYWZkLWI1OGEtNDcyZi1iODU3LTQ3NWE4NjNiNjliNiIsImRicyI6InNhbmRib3giLCJlbWFpbCI6ImphbmUuZG9lQGNyeXB0ci5jbyIsImV4cCI6MTY5MTE2NTE3NiwiaWF0IjoxNjU5NjI5MTc2LCJpcHMiOiJjcnlwdHIiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjQwMDAvdC9taXNhcHJldCIsImp0aSI6ImE0MmYzZTQ4LTFlOWMtNDA0ZC1hZWE0LWNjM2ZjZmViNjRkYyIsImp0dCI6ImFjY2VzcyIsInNjaSI6bnVsbCwic2NwIjpudWxsLCJzdWIiOiI1MzRkY2JlMC1jODhkLTQ0MWQtODRjZC0xZGFhOGRiYzgzOTMiLCJ0bnQiOiJtaXNhcHJldCIsInZlciI6MX0.avoeKsVAv-7zOMsbOHg_8G9h9Mp5Pb4F74ywVWmoAyS2wz8EO3acdlrMgzqpZadNK6ts9RHawonjMAciOABS5HbRl-xBSytRDI2R2t_aHxOmkjKaoowePc4N1KQHTY7iZjAKLG_d7GA6vFvqq1Jf-ARWBhJ-rCTJYGmhClbD5ADxfpZXWzYq0vWDlu7Q8IFuSe-pfUqGec_TjklXMoTtHtkYxfOy0NNoyF3nn63movBi-CevCQmslkl2TR4IYQ9jpXFftfiF4W7Y5rYBbMzRK442nz6qs2k9hpO_0yWmGBI1tsThnVd-kl5ODwcwHojXazjxQINb_qNPhpxPDrbnJmPk4T7JRTV5CxDM_XWtXq4lVvem2LPjb387SP_EY0_udR7UklEDJ9mUwLR6uGxxr0nYn6EXy-JAp4dyHNvCVrMwgtM_47GASlk7-8tsmLAGUGhafhDEhImBMBwBxbfUWVlRpj3IC_9iv3U1oH3Rj4v1wSY_7-upJnHPQH1CrsXnYn-tREGqN8OIc8OZPAvdxY9WXMnNxZBCoMXFQ_LawXZrcZ0pbIfCu-Hrl9IxhtO4o9bzDqDvrY-MzioF_rIYAL-gysycr7Ib62hVkWmamRE5dVcnj3n3yUvfcVeHQugk5Ur8ZOoMSD65EXcPTv-whBdCpcQgd5E0V2ruzh9MEPs"

describe('Cryptr Strategy - with valid cryptrconfig', () => {
  delete process.env.CRYPTR_TEST_MODE;
  let validStrategy = new Strategy(
    {
      cryptrConfig: validCryptrConfig
    },
    function (accessToken, idToken, profile, done) {}
  );

  it("should be named cryptr", function () {
    expect(validStrategy.name).toMatch("cryptr");
  });
  
  it("should have proper cryptrConfig", function () {
    expect(validStrategy.cryptrConfig).toEqual(validCryptrConfig);
  });
  
  it("should have default cryptrOpts", function () {
    expect(validStrategy.cryptrOpts).toEqual({ test: false });
  });
})

describe('Cryptr Strategy - with valid cryptrconfig and cryptrOpts', () => {
  var validStrategy = new Strategy(
    {
      cryptrConfig: validCryptrConfig,
      opts: { test: true }
    },
    function (accessToken, idToken, profile, done) {}
  );

  it("should be named cryptr", function () {
    expect(validStrategy.name).toMatch("cryptr");
  });
  
  it("should have proper cryptrConfig", function () {
    expect(validStrategy.cryptrConfig).toEqual(validCryptrConfig);
  });
  
  it("should have default cryptrOpts", function () {
    expect(validStrategy.cryptrOpts).toEqual({ test: true });
  });
})

describe('Cryptr Strategy - with wrong Config', () => {
  var wrongConfig = { cryptrConfig: {} };
  it("should throw TypeError", function () {
    expect(() => {
      new Strategy(wrongConfig, function (accessToken, idToken, profile, done) {});
    }).toThrow(TypeError);
  });

  it("should throw Env Var error message", function () {
    try {
      new Strategy(wrongConfig, function (accessToken, idToken, profile, done) {});
    } catch (e) {
      expect(e.message).toMatch(
        /Struct of Cryptr Strategy options Cryptr config MUST have params/
      );
    }
  });
  
  it("should throw error if no verify", function () {
    expect(() => {
      new Strategy(wrongConfig, null);
    }).toThrow(TypeError);
  });

  it("should throw Env Var error message", function () {
    try {
      new Strategy(wrongConfig, null);
    } catch (e) {
      expect(e.message).toMatch(/CryptrStrategy requires a verify callback/);
    }
  });
})

describe('Cryptr Strategy - with empty Config', () => {
  delete process.env.CRYPTR_TEST_MODE;
  delete process.env.CRYPTR_BASE_URL;
  delete process.env.CRYPTR_AUDIENCES;
  delete process.env.CRYPTR_TENANTS;
  delete process.env.CRYPTR_ISSUER;

  it("should throw TypeError", function () {
    expect(
      () => { new Strategy({}, function (accessToken, idToken, profile, done) {}) }
    ).toThrow(TypeError);
  });
  
  it("should throw Env Var error message", function () {
    try {
      new Strategy({}, function (accessToken, idToken, profile, done) {}); 
    } catch (e) {
      expect(e.message).toMatch(/You MUST set environment variables/)
    }
  });
})

describe("Cryptr Strategy - with valid cryptr config env vars", () => {
  beforeEach(() => {
    process.env = Object.assign(process.env, {
      CRYPTR_BASE_URL: validCryptrConfig.base_url,
      CRYPTR_AUDIENCES: validCryptrConfig.audiences,
      CRYPTR_TENANTS: validCryptrConfig.tenants,
      CRYPTR_CLIENT_IDS: validCryptrConfig.client_ids,
    });
  });

  it("should have set CRYPTR_AUDIENCES", () => {
    expect(process.env.CRYPTR_AUDIENCES.split(',')).toEqual(validCryptrConfig.audiences);
  });

  it("should have proper env cryptrConfig", () => {
    var validStrategy = new Strategy(
      {},
      (accessToken, idToken, profile, done) => {}
    );
    expect(validStrategy.cryptrConfig).toEqual(validCryptrConfig);
  });

  it("should have default cryptrOpts", function () {
    var validStrategy = new Strategy(
      {},
      (accessToken, idToken, profile, done) => {}
    );
    expect(validStrategy.cryptrOpts).toEqual({ test: false });
  });
});

describe("Cryptr Strategy - with valid env vars", () => {
  beforeEach(() => {
    process.env = Object.assign(process.env, {
      CRYPTR_TEST_MODE: true,
      CRYPTR_CLIENT_IDS: validCryptrConfig.client_ids
    });
  });

  it("should have set CRYPTR_AUDIENCES", () => {
    expect(process.env.CRYPTR_AUDIENCES.split(',')).toEqual(validCryptrConfig.audiences);
  });

  it("should have proper env cryptrConfig", () => {
    var validStrategy = new Strategy(
      {},
      (accessToken, idToken, profile, done) => {}
    );
    expect(validStrategy.cryptrConfig).toEqual(validCryptrConfig);
  });

  it("should have default cryptrOpts", function () {
    var validStrategy = new Strategy(
      {},
      (accessToken, idToken, profile, done) => {}
    );
    expect(validStrategy.cryptrOpts).toEqual({ test: true });
  });
});

describe('Cryptr Strategy - option as verify', () => {
  beforeEach(() => {
    process.env = Object.assign(process.env, {
      CRYPTR_AUDIENCES: validCryptrConfig.audiences,
      CRYPTR_CLIENT_IDS: validCryptrConfig.client_ids,
      NODE_ENV: 'development'
    });
  });

  var verify = function (accessToken, idToken, profile, done) {}

  it('should has proper verify' , () => {
    var strategy = new Strategy(verify)

    expect(strategy._verify).toEqual(verify)
  })
})

describe('Cryptr Strategy - _innerVerified', () => {
   beforeEach(() => {
    process.env = Object.assign(process.env, {
      CRYPTR_BASE_URL: validCryptrConfig.base_url,
      CRYPTR_AUDIENCES: validCryptrConfig.audiences,
      CRYPTR_ISSUER: validCryptrConfig.issuer,
      CRYPTR_TENANTS: validCryptrConfig.tenants,
      CRYPTR_CLIENT_IDS: validCryptrConfig.client_ids,
      NODE_ENV: 'development'
    });
  });

  var verify = function (accessToken, idToken, profile, done) {}

  it('should return error if error present', () => {
    let strategy = new Strategy(verify);
    const errorMsg = "Some error occured";
    strategy.error = (err) => err;
    const innerVerification = strategy._innerVerified(strategy, errorMsg, null, null)
    expect(innerVerification).toEqual(errorMsg);
  })
 
  it('should return resource_owner and info if success', () => {
    let strategy = new Strategy(verify);
    const resource_owner = "jane.doe@cryptr.co";
    const info = "Some info";
    const successFn = jest.fn();
    strategy.success = successFn;
    strategy._innerVerified(strategy, null, resource_owner, info)
    expect(successFn).toHaveBeenCalledWith(resource_owner, info);
  })
})

describe('Cryptr Strategy - _verifyToken', () => {
  beforeEach(() => {
    process.env = Object.assign(process.env, {
      CRYPTR_BASE_URL: validCryptrConfig.base_url,
      CRYPTR_AUDIENCES: validCryptrConfig.audiences,
      CRYPTR_ISSUER: validCryptrConfig.issuer,
      CRYPTR_TENANTS: validCryptrConfig.tenants,
      NODE_ENV: 'development'
    });
  });

  let verify = function (accessToken, idToken, profile, done) {}

  xit('should crash if undefined token', () => {
    let strategy = new Strategy(verify);
    strategy.fail = (err) => err;
    const res = strategy._verifyToken(undefined, strategy, null, null)
    expect(res.toString()).toEqual("TypeError: Cannot read property 'split' of undefined");
  })
})