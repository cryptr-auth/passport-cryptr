/**
 * @jest-environment node
 */
let Strategy = require('../lib/strategy')

var validCryptrConfig = {
  base_url: "http://localhost:4000",
  audiences: ["http://localhost:4200"],
  client_id: "f407cafd-b58a-472f-b857-475a863b69b6",
  issuer: "http://localhost:4000/t/shark-academy",
  tenants: ["shark-academy"],
};

var validClaims = {
  "application_metadata": {},
  "aud": "http://localhost:4200",
  "cid": "f407cafd-b58a-472f-b857-475a863b69b6",
  "exp": 1691159287,
  "iat": 1659623287,
  "dbs": "sandbox",
  "email": "jane.doe@cryptr.co",
  "ips": "cryptr",
  "iss": "http://localhost:4000/t/shark-academy",
  "jti": "a7debdc6-8531-4c64-9666-5d6211765d55",
  "jtt": "access",
  "sci": null,
  "scp": null,
  "sub": "534dcbe0-c88d-441d-84cd-1daa8dbc8393",
  "tnt": "shark-academy",
  "ver": 1
}

var validToken =
  "eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC90L3NoYXJrLWFjYWRlbXkiLCJraWQiOiI5ZjhlNTE1MC1lNWIxLTQ4MWEtOTAyNS1mYzc2YmQ1Y2JlYmUiLCJ0eXAiOiJKV1QifQ.eyJhcHBsaWNhdGlvbl9tZXRhZGF0YSI6e30sImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCIsImNpZCI6ImY0MDdjYWZkLWI1OGEtNDcyZi1iODU3LTQ3NWE4NjNiNjliNiIsImRicyI6InNhbmRib3giLCJlbWFpbCI6ImphbmUuZG9lQGNyeXB0ci5jbyIsImV4cCI6MTY5MTE1OTI4NywiaWF0IjoxNjU5NjIzMjg3LCJpcHMiOiJjcnlwdHIiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjQwMDAvdC9zaGFyay1hY2FkZW15IiwianRpIjoiYTdkZWJkYzYtODUzMS00YzY0LTk2NjYtNWQ2MjExNzY1ZDU1IiwianR0IjoiYWNjZXNzIiwic2NpIjpudWxsLCJzY3AiOm51bGwsInN1YiI6IjUzNGRjYmUwLWM4OGQtNDQxZC04NGNkLTFkYWE4ZGJjODM5MyIsInRudCI6InNoYXJrLWFjYWRlbXkiLCJ2ZXIiOjF9.jMuZGwCx6EdllJB-fAqEU82Ow7AfsAvVRuZ5w4WD0O8GhSqzcoL1tkb3MTwNqabnLD1NRyNAgekr8w3YBhkAql9nAmRtKi4Ax1tQBtbydgV0cqyBAse_0teWfJgZb6XX28fntmtBuLCR5FQug5XBSo-ynfPWPwRSw94IqlH6xmnWMsMf8TAYiILNzdK6T93Vk-ht8jhkfynbOn8fsGJXGwjtXXiLLaO5aeaN2lqhRTT6fqkEuisB6hN_fFuoZsfHqeAdPxuzxAxrhx_mM84nOFnvbwilwQclFn4KWRFfbksPgUp7Ux2iaJx5-Q3mEup8hbZjFSl1Og7ohbryWp17ocitNRpPaUZNZ04PeYbiFSW36-pgDS5ipzAWI3cTGsPpQ-SP75nSg2xEEv8z7NVfm4V5cHghSfwfMyBnExjNvVrhffTMbRU8B2zp1Z7tKF9dVlYwaXki1np8IBw66XQj73bDrAnwCfkQJerJx1Ctah5S8UFmvXXfMCVbS471OhuGPfm77hmpYnPfibgXJuqBSNkLtaYlPK0VexuDa-Vi5ZFIrhAs41zmZSpC5WmJ1ksTXtvatJH2reKa-_4oMtRtKwG1wu__ULkoxVRvPd0pg_WpT6WhEdt79OTvq4a86LL59GXrkiH5P8DMzLKJiJoE-renm3k7MtDRGJD1-rhVufE";
var otherTenantToken =
  "eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC90L21pc2FwcmV0Iiwia2lkIjoiYWIwYWZmZDgtZDM0Zi00YjMwLWIwNGEtYzMzN2E2ZjNmNjBjIiwidHlwIjoiSldUIn0.eyJhcHBsaWNhdGlvbl9tZXRhZGF0YSI6e30sImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCIsImNpZCI6ImY0MDdjYWZkLWI1OGEtNDcyZi1iODU3LTQ3NWE4NjNiNjliNiIsImRicyI6InNhbmRib3giLCJlbWFpbCI6ImphbmUuZG9lQGNyeXB0ci5jbyIsImV4cCI6MTY5MTE2NTE3NiwiaWF0IjoxNjU5NjI5MTc2LCJpcHMiOiJjcnlwdHIiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjQwMDAvdC9taXNhcHJldCIsImp0aSI6ImE0MmYzZTQ4LTFlOWMtNDA0ZC1hZWE0LWNjM2ZjZmViNjRkYyIsImp0dCI6ImFjY2VzcyIsInNjaSI6bnVsbCwic2NwIjpudWxsLCJzdWIiOiI1MzRkY2JlMC1jODhkLTQ0MWQtODRjZC0xZGFhOGRiYzgzOTMiLCJ0bnQiOiJtaXNhcHJldCIsInZlciI6MX0.avoeKsVAv-7zOMsbOHg_8G9h9Mp5Pb4F74ywVWmoAyS2wz8EO3acdlrMgzqpZadNK6ts9RHawonjMAciOABS5HbRl-xBSytRDI2R2t_aHxOmkjKaoowePc4N1KQHTY7iZjAKLG_d7GA6vFvqq1Jf-ARWBhJ-rCTJYGmhClbD5ADxfpZXWzYq0vWDlu7Q8IFuSe-pfUqGec_TjklXMoTtHtkYxfOy0NNoyF3nn63movBi-CevCQmslkl2TR4IYQ9jpXFftfiF4W7Y5rYBbMzRK442nz6qs2k9hpO_0yWmGBI1tsThnVd-kl5ODwcwHojXazjxQINb_qNPhpxPDrbnJmPk4T7JRTV5CxDM_XWtXq4lVvem2LPjb387SP_EY0_udR7UklEDJ9mUwLR6uGxxr0nYn6EXy-JAp4dyHNvCVrMwgtM_47GASlk7-8tsmLAGUGhafhDEhImBMBwBxbfUWVlRpj3IC_9iv3U1oH3Rj4v1wSY_7-upJnHPQH1CrsXnYn-tREGqN8OIc8OZPAvdxY9WXMnNxZBCoMXFQ_LawXZrcZ0pbIfCu-Hrl9IxhtO4o9bzDqDvrY-MzioF_rIYAL-gysycr7Ib62hVkWmamRE5dVcnj3n3yUvfcVeHQugk5Ur8ZOoMSD65EXcPTv-whBdCpcQgd5E0V2ruzh9MEPs"
var validHeaderRequest = {
  headers: {
    authorization: `Bearer ${validToken}`,
  },
};

var wrongSyntaxedHeaderRequest = {
  headers: {
    authorization: validToken,
  },
};

var otherTenantHeaderRequest = {
  headers: {
    authorization: `Bearer ${otherTenantToken}`,
  },
};

var validBodyRequest = {
  body: {
    access_token: validToken,
  },
};

var validQueryRequest = {
  query: {
    access_token: validToken,
  },
};

beforeEach(() => {
  process.env = Object.assign(process.env, {
    CRYPTR_BASE_URL: validCryptrConfig.base_url,
    CRYPTR_AUDIENCES: validCryptrConfig.audiences,
    CRYPTR_CLIENT_ID: validCryptrConfig.client_id,
    CRYPTR_ISSUER: validCryptrConfig.issuer,
    CRYPTR_TENANTS: validCryptrConfig.tenants,
    CRYPTR_TEST_MODE: true
  });
})

describe('Cryptr Strategy authenticate with valid Request Headers', () => {
  let jwt, verify;


  beforeEach(async () => {
    await new Strategy({}, function (j, v) {
      jwt = j;
      verify = v;
    }).authenticate(validHeaderRequest);
  })


  xit('should return valid true', async () => {
      expect(jwt.valid).toEqual(true);
  })
  
  xit('should return claims key', async () => {
    expect(jwt.claims).not.toBe(undefined)
  })
  
  xit('should return valid claims', async () => {
    expect(jwt.claims).toEqual(validClaims)
  })
})

describe('Cryptr Strategy authenticate with other tenant Request Headers', () => {
  let jwt, verify;

  beforeEach(async () => {
    await new Strategy({}, function (j, v) {
      jwt = j;
      verify = v;
    }).authenticate(otherTenantHeaderRequest);
  })

  it('should return valid false', async () => {
    expect(jwt.valid).toEqual(false)
  })
  
  it('should not return claims key', async () => {
    expect(jwt.claims).toBe(undefined)
  })
  
  xit('should not return signing key error', async () => {
    expect(jwt.errors).toMatch(/Unable to find a signing key that matches/)
  })
})

describe('Cryptr Strategy authenticate with wrong syntaxed Authorization Request Headers', () => {
  let jwt;
  // let verify;

  beforeEach(async () => {
    await new Strategy({}, function (j, v) {
      jwt = j;
      verify = v;
    }).authenticate(wrongSyntaxedHeaderRequest);
  })


  it('should return not valid', async () => {
    expect(jwt.valid).toEqual(false)
  })
  
  it('should not return claims', async () => {
    expect(jwt.claims).toEqual(undefined)
  })
  
  it('should return invalid token error', async () => {
    expect(jwt.errors).toEqual("Invalid token specified")
  })
})

describe('Cryptr Strategy authenticate with valid Request body', () => {
  // let jwt, verify;

  beforeEach(async () => {
    await new Strategy({}, function (j, v) {
      jwt = j;
      verify = v;
    }).authenticate(validBodyRequest);
  })


  xit('should return valid true', async () => {
    expect(jwt.valid).toEqual(true)
  })
  
  xit('should return claims key', async () => {
    expect(jwt.claims).not.toBe(undefined)
  })
  
  xit('should return valid claims', async () => {
    expect(jwt.claims).toEqual(validClaims)
  })
})

describe('Cryptr Strategy authenticate with valid Request query', () => {
  // let jwt, verify;

  beforeEach(async () => {
    await new Strategy({}, function (j, v) {
      jwt = j;
      verify = v;
    }).authenticate(validQueryRequest);
  })


  xit('should return valid true', async () => {
    expect(jwt.valid).toEqual(true)
  })
  
  xit('should return claims key', async () => {
    expect(jwt.claims).not.toBe(undefined)
  })
  
  xit('should return valid claims', async () => {
    expect(jwt.claims).toEqual(validClaims)
  })
})

describe('Cryptr Strategy with cryptrconfig and passReqToCallback opt', () => {
  // var req, jwt, verify;

  beforeEach(async () => {
    await new Strategy({
      cryptrConfig: validCryptrConfig,
      passReqToCallback: true
    }, function (r, j, v) {
      req = r
      jwt = j;
      verify = v;
    }).authenticate(validHeaderRequest);
  })

  xit('should return request', () => {
    expect(req).toEqual(validHeaderRequest)
  })
  xit('should return valid claims', () => {
    expect(jwt.claims).toEqual(validClaims)
  })
  
  xit('should return valid', () => {
    expect(jwt.valid).toEqual(true)
  })
})

describe('Cryptr Strategy with cryptrconfig testing verified', () => {
  // let jwt, verify;

  beforeEach(async () => {
    const i = await new Strategy({
      cryptrConfig: validCryptrConfig,
    }, function (j, v) {
      jwt = j;
      verify = v;
    }).authenticate(validHeaderRequest);
  })

  xit('should return verified function', () => {
    expect(verify.name).toEqual('verified')
  })
  
  it('should return verified function', () => {
    expect(typeof verify).toBe('function')
  })

  //TODO: better verified testing implementation
  it('should return err if err in verified', () => {
    expect(verify('My error', null, null)).toBe(undefined)
  })
  
  it('should return info if info in verified', () => {
    expect(verify(null, null, 'info')).toBe(undefined)
  })
  
  it('should return resourceOwner if resourceOner in verified', () => {
    expect(verify(null, {email: 'myemail@client.io'}, null)).toBe(undefined)
  })
  
})

describe('Cryptr Strategy with cryptrconfig and tokenless request', () => {
  let jwt;
  let verify;

  beforeEach(async () => {
    await new Strategy({
      cryptrConfig: validCryptrConfig,
    }, function (j, v) {
      jwt = j;
      verify = v;
    }).authenticate({});
  })

  it('should return not valid', async () => {
    expect(jwt.valid).toEqual(false)
  })
  
  it('should not return claims', async () => {
    expect(jwt.claims).toEqual(undefined)
  })
  
  it('should return no token error', async () => {
    expect(jwt.errors).toEqual("No token specified")
  })
})

describe('Cryptr Strategy with cryptrconfig and token in header and in query', () => {
  let jwt, verify;

  beforeEach(async () => {
    await new Strategy({
      cryptrConfig: validCryptrConfig,
    }, function (j, v) {
      jwt = j;
      verify = v;
    }).authenticate({...validHeaderRequest, ...validBodyRequest});
  })

  it('should return not valid', async () => {
    expect(jwt.valid).toEqual(false)
  })
  
  it('should not return claims', async () => {
    expect(jwt.claims).toEqual(undefined)
  })
  
  it('should return no token error', async () => {
    expect(jwt.errors).toEqual(`Already found token ${validToken} in Authorization Bearer`)
  })
})

describe('Cryptr Strategy with cryptrconfig and token in body and in query', () => {
  let jwt, verify;

  beforeEach(async () => {
    await new Strategy({
      cryptrConfig: validCryptrConfig,
    }, function (j, v) {
      jwt = j;
      verify = v;
    }).authenticate({...validBodyRequest, ...validQueryRequest});
  })

  it('should return not valid', async () => {
    expect(jwt.valid).toEqual(false)
  })
  
  it('should not return claims', async () => {
    expect(jwt.claims).toEqual(undefined)
  })
  
  it('should return no token error', async () => {
    expect(jwt.errors).toEqual(`Already found token ${validToken} in body`)
  })
})