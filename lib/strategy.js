let passport = require("passport-strategy"),
  util = require("util");
let CryptrJwtVerifier = require("@cryptr/cryptr-jwt-verifier");
const { config } = require("process");


/**
 * Creates an instance of `Strategy`.
 *
 *
 * Examples:
 *
 *     passport.use(new CryptrStrategy(
 *       function(jwt, done) {
 *         User.findByClaims({ claims: jwt.claims }, function (err, user) {
 *           if (err) { return done(err); }
 *           if (!user) { return done(null, false); }
 *           return done(null, user, { scope: 'limited' });
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {Object} [options]
 * @param {Function} verify
 * @api public
 */
class Strategy {

  constructor(options, verify) {
    if (typeof options == "function") {
      verify = options;
      options = null;
    }
    if (!verify) {
      throw new TypeError("CryptrStrategy requires a verify callback");
    }
  
    passport.Strategy.call(this);
    this.name = "cryptr";
    this._verify = verify;
  
  
    if (options && options.cryptrConfig) {
      let cryptrConfig = options.cryptrConfig;
      if (
        !cryptrConfig.issuer ||
        !cryptrConfig.audiences ||
        !cryptrConfig.tenants
      ) {
        throw new TypeError(`Struct of Cryptr Strategy options Cryptr config MUST have params
          audiences
          issuer
          tenants`);
      } else {
        this.cryptrConfig = cryptrConfig;
      }
    } else if (
      !process.env.CRYPTR_AUDIENCES ||
      !process.env.CRYPTR_ISSUER ||
      !process.env.CRYPTR_TENANTS
    ) {
      throw new TypeError(`If you do not provide cryptrConfig in Cryptr strategy 
        You MUST set environment variables
        'CRYPTR_AUDIENCES',
        'CRYPTR_ISSUER'
        'CRYPTR_TENANTS'
        `);
    } else {
      if (process.env.NODE_ENV === 'development') {
        /* istanbul ignore next */
       console.info(
         `You do not set config for cryptr strategy -> auto-set with environment variables`
       ); 
      }
      this.cryptrConfig = {
        audiences: process.env.CRYPTR_AUDIENCES.split(','),
        issuer: process.env.CRYPTR_ISSUER,
        tenants: process.env.CRYPTR_TENANTS.split(','),
      };
    }
    if (options && options.opts && "test" in options.opts) {
      this.cryptrOpts = options.opts;
    } else {
      const devMode = process.env.CRYPTR_TEST_MODE == "true" || process.env.NODE_ENV === "development";
      if (process.env.NODE_ENV === 'development') {
        /* istanbul ignore next */
        console.info(
          `You do not set test mode in opts for cryptr strategy -> set using env to: ${devMode}`
        );
      }
      this.cryptrOpts = {
        test: devMode,
      };
    }
    if (options) {
      this._passReqToCallback = options.passReqToCallback;
    }
  
    if(this.fail == undefined) {
      this.fail = this._fail
    }
  }
}

util.inherits(Strategy, passport.Strategy);

Strategy.prototype.authenticate = async function (req) {
  let token, source;

  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length == 2) {
      const scheme = parts[0],
        credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
        source = 'Authorization Bearer'
      }
    } else if(this.fail) {
      return this.fail("Invalid token specified");
    }
  }

  if (req.body && req.body.access_token) {
    if (token) {
      return this.fail(`Already found token ${token} in ${source}`);
    }
    token = req.body.access_token;
    source = 'body'
  }

  if (req.query && req.query.access_token) {
    if (token) {
      return this.fail(`Already found token ${token} in ${source}`);
    }
    token = req.query.access_token;
  }

  if (!token) {
    return this.fail("No token specified");
  }

  let self = this;

  function verified(err, resource_owner, info) {
    if (err && self.error) {
      return self.error(err);
    }
    if (!resource_owner) {
      if (typeof info == "string") {
        info = { message: info };
      }
      info = info || {};
      if(self.fail) {
        return self.fail("invalid_token");
      }
    }
    if(self.success) {
      self.success(resource_owner, info);
    }
  }

  try {
    const verifier = new CryptrJwtVerifier.default(
      this.cryptrConfig,
      this.cryptrOpts
    );
    return verifier
      .verify(token)
      .then((jwt) => {
        if (self._passReqToCallback) {
          return this._verify(req, jwt, verified);
        } else {
          return this._verify(jwt, verified);
        }
      })
      .catch((error) => {
        return this.fail(error)
      });
  } catch (err) {
    return this.fail(err)
  }

};

Strategy.prototype._fail = function (error) {
  if((typeof error == 'object') && "valid" in error && "errors" in error) {
    return this._verify(error);
  }
  return this._verify({valid: false, errors: error}, {})
}

module.exports = Strategy;
