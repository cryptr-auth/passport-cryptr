| Statements                | Branches                | Functions                |
| ------------------------- | ----------------------- | ------------------------ |
| ![Statements](https://img.shields.io/badge/Coverage-96.1%25-brightgreen.svg) | ![Branches](https://img.shields.io/badge/Coverage-92.31%25-brightgreen.svg) | ![Functions](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) |


# passport-cryptr

Cryptr Authentication Strategy for Passport.js.

Use it in your Node/Express/Nest project when you are using PassportJs to authorize actions or access on specific controller routes

## Configuration

### CryptrConfig

You have two choices :

1. Use Environnment variables:

  ```bash
  # .env
  CRYPTR_AUDIENCES=YOUR_FRONT_CLIENT_URLS
  CRYPTR_TENANTS=YOUR_TENANT_DOMAINS
  CRYPTR_ISSUER=ISSUER_FOR_YOUR_DOMAIN
  CRYPTR_TEST_MODE=false
  ```

2. Use config struct

Your config should follow this interface

```typescript
{
  audiences: string[],
  tenants: string[],
  issuer: string
}
```

example:

```typescript
const CRYPTR_DEV_CONFIG = {
  "audiences": ["http://127.0.0.1:3000"],
  "tenants": ["my-domain"],
  "issuer": "my_issuer_url"
}
```

### Opts

For now opts follow this struct

```typescript
opts?: {
  test: boolean
}
```

:warning: if you don not use `opts` value for `test` will be

- prior to `CRYPTR_TEST_MODE` env value
- or result of `NODE_ENV === 'development'` if prior not succeed

## Use Cryptr Passport Strategy

### What is the return of Strategy ?

**Structure**

```typescript
interface Claims {
  aud: string
  cid: string
  exp: number
  iat: number
  iss: string
  jti: string
  jtt: string
  resource_owner_metadata: any
  scp: Array<string>
  sub: string
  tnt: string
  version: number
}

interface CryptrStrategyResult {
  valid: boolean
  claims?: Claims
  errors?: string
}
```

- `valid` -> is the token provided is validated from our service
- `claims` all data that we can provide to you about the claims of the token
- `errors`-> Inform you about what makes it not valid (mainly `No Compliant claims`)

### How to manage this?

The purpose of the result is there to help you authorize or not the end-user to access or do something.
If all your tests are successfull -> authorize
If not you should throw an unauthorized error

#### Basic behaviour

No need really to expand how but if you don not need extra data from claims you can basically check for success:

```js
let success = res.valid && res.claims !== undefined && res.errors === undefined
```

#### More testing

This section explain how to manage claims in aim to authorize your end-user action

Main properties to check:

- `resource_owner_metadata`
- `scp`
- `tnt`
- `exp`
- `version`

1. `resource_owner_metadata` this property reflects metadata you register in Cryptr DB about your end-user properties. **This is an object or a null value**

  :warning: the following keys are not accurate, keys you receive are related to metadata you set to your tenant in cryptr

  `your_user_id` related to the ID of the end user in your DB
  `section` related to your website section where to redirect end-user
  `page-preferences` related to page settings end-user chose

2. `scp` is the current allowed scope for this token.
  
  the value is one of defined in your applciation `allowed_scopes`
  :warning: if the value is `['limited']` that means you **should** constrain end-user to limited actions/access . This value occurs mainly when token came from a refresh token rotation.

3. `tnt` **should ALWAYS be your cryptr tenant domain**

4. `exp` is a timestamp and represent when this token expires, If it's in the past it should be not valid

5. `version` Is now `1` but may increment in future update of this strategy