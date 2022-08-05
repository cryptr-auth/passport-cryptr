var Strategy = require("../lib/strategy");

var validCryptrConfig = {
  base_url: "http://localhost:4000",
  audiences: ["http://localhost:3001"],
  issuer: "http://localhost:4000",
  tenants: ["cryptr-cryptr"],
};

describe('Cryptr Strategy - with valid cryptrconfig', () => {
  delete process.env.CRYPTR_TEST_MODE;
  var validStrategy = new Strategy(
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
      CRYPTR_ISSUER: validCryptrConfig.issuer,
      CRYPTR_TENANTS: validCryptrConfig.tenants,
    });
  });

  it("should have set CRYPTR_AUDIENCES", () => {
    expect(process.env.CRYPTR_AUDIENCES.split(',')).toEqual(validCryptrConfig.audiences);
  });

  it("should have set CRYPTR_ISSUER", () => {
    expect(process.env.CRYPTR_ISSUER).toMatch(validCryptrConfig.issuer);
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
      CRYPTR_TEST_MODE: true
    });
  });

  it("should have set CRYPTR_AUDIENCES", () => {
    expect(process.env.CRYPTR_AUDIENCES.split(',')).toEqual(validCryptrConfig.audiences);
  });

  it("should have set CRYPTR_ISSUER", () => {
    expect(process.env.CRYPTR_ISSUER).toMatch(validCryptrConfig.issuer);
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
      CRYPTR_ISSUER: validCryptrConfig.issuer,
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