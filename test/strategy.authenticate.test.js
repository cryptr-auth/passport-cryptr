/**
 * @jest-environment node
 */
var Strategy = require('../lib/strategy')

var validCryptrConfig = {
  audiences: ["http://localhost:4200"],
  client_id: "724b141a-e1eb-4f5b-bfca-22eca8ae3cc4",
  issuer: "http://localhost:4000/t/shark-academy",
  tenants: ["shark-academy"],
};

var validClaims = {
  "aud": "http://localhost:4200",
  "cid": "724b141a-e1eb-4f5b-bfca-22eca8ae3cc4",
  "exp": 1611158700928,
  "iat": 1611157800928,
  "iss": "http://localhost:4000/t/shark-academy",
  "jti": "024e05e0-d97a-4f15-94a6-bcadeabf538b",
  "jtt": "access",
  "resource_owner_metadata": {},
  "scp": [
    "limited"
  ],
  "sub": "eba25511-afce-4c8e-8cab-f82822434648",
  "tnt": "shark-academy",
  "ver": 1
}

var validToken =
  "eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC90L3NoYXJrLWFjYWRlbXkiLCJraWQiOiI5ZjhlNTE1MC1lNWIxLTQ4MWEtOTAyNS1mYzc2YmQ1Y2JlYmUiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAiLCJjaWQiOiI3MjRiMTQxYS1lMWViLTRmNWItYmZjYS0yMmVjYThhZTNjYzQiLCJleHAiOjE2MTExNTg3MDA5MjgsImlhdCI6MTYxMTE1NzgwMDkyOCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwL3Qvc2hhcmstYWNhZGVteSIsImp0aSI6IjAyNGUwNWUwLWQ5N2EtNGYxNS05NGE2LWJjYWRlYWJmNTM4YiIsImp0dCI6ImFjY2VzcyIsInJlc291cmNlX293bmVyX21ldGFkYXRhIjp7fSwic2NwIjpbImxpbWl0ZWQiXSwic3ViIjoiZWJhMjU1MTEtYWZjZS00YzhlLThjYWItZjgyODIyNDM0NjQ4IiwidG50Ijoic2hhcmstYWNhZGVteSIsInZlciI6MX0.A2a-f-rIGCGon9LdeiqSydhshLnq92U5h5BTjL5F9R6DCqQzsZ1XVVUxeUmdLkMNXJ8XAEti6UQvVAavh8JZ3pckr_75U57r1gKoqakApMYSj3FjYbn-EnivIAH6W8R_YBxaM6o5T2fiqqmcr97dlId_fjS0ZSsVSIhCHD8vMiIMDT0o1SnENTRSrtOQgwGYOOiYsmCZgkFGXXYdQBomDG1RlznWQwzdEpd_jjgdCnEYZDBEbwkzguTv9oI5Dv5F2YlHbBNg-iOrw2IGUzNU-0EopqlKEq-SoC1y4BcsgfmY_4rp-yDWXSVY62aoIRDAaMqwjQ3ggOxmZzSdxo2AP2QRljeKo11e6fdmWucHfcfVuxD4QIX0LyILidkhy67hb0sLYCobmOkCluUaAHj6bN1KyzbvjRODVhJOOhVbm2qgO1FayVwrX0HhS5mqxUJVlCzCoqTr-0BhFokToxnKeel2Syn1dLjeQqdSjB0HROjqx7_mSM02Qp5wknHA7Tmb5R14197Aom-WMtbb73TC3SreWP48S7_jdcVT_-VdE36D53ycx2KRNsnzmVmjhIyAgf4Mi1vs3bCS4winb0lSLAXbKvtEnumBtEI_pczgwtKObbMn1ODmyivDt8rpQjDLCK5Bnt-wMgn0C9lvQWjJRyMshcLcIMv0VfFrzqXEPRw";
var otherTenantToken =
  "eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC90L21pc2FwcmV0Iiwia2lkIjoiOTJlODM0MGItNGViOS00ODczLWIzMDYtZjA5M2FhNWEzNDNjIiwidHlwIjoiSldUIn0.eyJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJjaWQiOiI0MmJkYjkxOS1iNGE0LTQ4MTYtODJjNC05YjIxZmY1NDY4NzYiLCJleHAiOjE2MDAzNjQ5MDk4OTYsImlhdCI6MTYwMDMyODkwOTg5NiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwL3QvbWlzYXByZXQiLCJqdGkiOiJkNGE3NGUyMC04YzQ3LTQ2ZGItYWY1Yi00Mzk4NDc3NTA2ZjEiLCJqdHQiOiJhY2Nlc3MiLCJyZXNvdXJjZV9vd25lcl9tZXRhZGF0YSI6eyJjdXJyZW50X3Byb2plY3RfaWQiOiJmNWNlMDQ0Ny0xNjNkLTQ5ZmMtYTI5ZS1iZDgyMjljMWE1ZTYifSwic2NwIjpbImVtYWlsIl0sInN1YiI6IjViMzAyYThkLTUzYzktNDY5OC05MTQyLTM2YjkxMGYzYWI4NCIsInRudCI6Im1pc2FwcmV0IiwidmVyIjoxfQ.aC-t1IX3nqJ1oQIMIiTUHyq5Ic5MNNHFi03u9CQe18s4ejemPwDfLTgVDD7X2b1peIEr9ruap7tTGif8jYaNDN29eFpPnNw5wywhF1gNy4sPjLrvltZuVwKWee6UwxLtdMLjPkBIbS-_g1kLoatYsSrFwCQIcZnPanA82Knt72pbnjKEvscPqoNJ0wNJYF1drb9duNhNm470djUFWVzd8NSpWMigLFHIV7OtrWALhDjliUMliBo-7PRxZns4M5Yjw_6g20BpwcIJ2TK1DaiB74qyzzARuJanLTqmo-2U5CeoO2UDNIFh-7idePenbjR5nQkl7EjrNfwz0X9aAVBb8WsTMnC_ONVK4qlkZN4QAEilZbugxXrg9C3uQv0DJeuh0IueAvuF8qY680sFnLbo37VXlbohUGamlMieiehZ_mubz1pDVthpTQTIUC_v4zmL3CfyelAwnxYpK8NYn7t1Ju_ep1j_1MJsnkAUaKOkGwPslSNfLWtzQLg-UXFesU27f4lNNOdHJz5qUrKo-w6V_6hORZ9RV682AKRVLAVpHknM6a9SRhwweupE8b4lAtmblfO163szJFZ8SwmbruvPPNH-EWAdYdHruPNhgjDHsl3yv8PwmT9Ryol0zfs_aNU_IMnHNmCVVIXlGpqqaWu1GurPh7R53Sm80dWbwJbjL9Y"
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

var notMatchingHeaderRequest = {
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
    CRYPTR_AUDIENCES: validCryptrConfig.audiences,
    CRYPTR_CLIENT_ID: validCryptrConfig.client_id,
    CRYPTR_ISSUER: validCryptrConfig.issuer,
    CRYPTR_TENANTS: validCryptrConfig.tenants,
    CRYPTR_TEST_MODE: true
  });
})

describe('Cryptr Strategy authenticate with valid Request Headers', () => {
  var jwt, verify;

  beforeEach(async () => {
    await new Strategy({}, function (j, v) {
      jwt = j;
      verify = v;
    }).authenticate(validHeaderRequest);
  })


  it('should return valid true', async () => {
      expect(jwt.valid).toEqual(true);
  })
  
  it('should return claims key', async () => {
    expect(jwt.claims).not.toBe(undefined)
  })
  
  it('should return valid claims', async () => {
    expect(jwt.claims).toEqual(validClaims)
  })
})

describe('Cryptr Strategy authenticate with other tenant Request Headers', () => {
  var jwt, verify;

  beforeEach(async () => {
    await new Strategy({}, function (j, v) {
      jwt = j;
      verify = v;
    }).authenticate(notMatchingHeaderRequest);
  })

  it('should return valid false', async () => {
    expect(jwt.valid).toEqual(false)
  })
  
  it('should not return claims key', async () => {
    expect(jwt.claims).toBe(undefined)
  })
  
  it('should not return signing key error', async () => {
    expect(jwt.errors).toMatch(/Unable to find a signing key that matches/)
  })
})

describe('Cryptr Strategy authenticate with wrong syntaxed Authorization Request Headers', () => {
  var jwt, verify;

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
  var jwt, verify;

  beforeEach(async () => {
    await new Strategy({}, function (j, v) {
      jwt = j;
      verify = v;
    }).authenticate(validBodyRequest);
  })


  it('should return valid true', async () => {
    expect(jwt.valid).toEqual(true)
  })
  
  it('should return claims key', async () => {
    expect(jwt.claims).not.toBe(undefined)
  })
  
  it('should return valid claims', async () => {
    expect(jwt.claims).toEqual(validClaims)
  })
})

describe('Cryptr Strategy authenticate with valid Request query', () => {
  var jwt, verify;

  beforeEach(async () => {
    await new Strategy({}, function (j, v) {
      jwt = j;
      verify = v;
    }).authenticate(validQueryRequest);
  })


  it('should return valid true', async () => {
    expect(jwt.valid).toEqual(true)
  })
  
  it('should return claims key', async () => {
    expect(jwt.claims).not.toBe(undefined)
  })
  
  it('should return valid claims', async () => {
    expect(jwt.claims).toEqual(validClaims)
  })
})

describe('Cryptr Strategy with cryptrconfig and passReqToCallback opt', () => {
  var req, jwt, verify;

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

  it('should return request', () => {
    expect(req).toEqual(validHeaderRequest)
  })
  it('should return valid claims', () => {
    expect(jwt.claims).toEqual(validClaims)
  })
  
  it('should return valid', () => {
    expect(jwt.valid).toEqual(true)
  })
})

describe('Cryptr Strategy with cryptrconfig testing verified', () => {
  var jwt, verify;

  beforeEach(async () => {
    await new Strategy({
      cryptrConfig: validCryptrConfig,
    }, function (j, v) {
      jwt = j;
      verify = v;
    }).authenticate(validHeaderRequest);
  })

  it('should return verified function', () => {
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
  var jwt, verify;

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
  var jwt, verify;

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
  var jwt, verify;

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