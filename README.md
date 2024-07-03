| Statements                | Branches                | Functions                |
| ------------------------- | ----------------------- | ------------------------ |
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-95%25-brightgreen.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat) |

# passport-cryptr

Version `1.1.2`

Cryptr Authentication Strategy for Passport.js.

Use it in your Node/Express/Nest project when you are using PassportJs to authorize actions or access specific controller routes

Based on `passport-strategy@1.x.x`  and `passport@^0.6.0`

- [passport-cryptr](#passport-cryptr)
  - [Configuration](#configuration)
    - [CryptrConfig](#cryptrconfig)
    - [Opts](#opts)
    - [How to handle migration to SDK v \>= 1.0.0](#how-to-handle-migration-to-sdk-v--100)
  - [Use Cryptr Passport Strategy](#use-cryptr-passport-strategy)
    - [What is the return of Strategy ?](#what-is-the-return-of-strategy-)
    - [When token prior to version 3](#when-token-prior-to-version-3)
    - [How to manage this?](#how-to-manage-this)
      - [Basic behaviour](#basic-behaviour)
      - [More testing](#more-testing)
    - [When token since version 3](#when-token-since-version-3)
      - [Obsolete claims](#obsolete-claims)
      - [Renamed claims](#renamed-claims)
      - [New claims](#new-claims)


## Configuration

### CryptrConfig

You have two choices :

1. Use Environnment variables:

  ```bash
  # .env
  CRYPTR_AUDIENCES=YOUR_FRONT_CLIENT_URLS
  CRYPTR_CLIENT_IDS=YOUR_FRONT_CLIENT_IDS
  CRYPTR_TENANTS=YOUR_TENANT_DOMAINS
  CRYPTR_BASE_URL=ISSUER_FOR_YOUR_DOMAIN
  CRYPTR_TEST_MODE=false
  ```

2. Use config struct

Your config should follow this interface

```typescript
{
  audiences: string[],
  tenants: string[],
  client_ids: string[],
  base_url: string
}
```

example:

```typescript
const CRYPTR_DEV_CONFIG = {
  "audiences": ["http://127.0.0.1:3000"],
  "client_ids": ["8363b1b4-68bb-4257-9e45-5513aecc1703"],
  "tenants": ["my-domain"],
  "base_url": "https://my-domain.authent.me"
}
```

### Opts

For now, opts follow this struct

```typescript
opts?: {
  test: boolean
}
```

:warning: if you do not use `opts` value for `test` will be

- prior to `CRYPTR_TEST_MODE` env value
- or result of `NODE_ENV === 'development'` if prior not succeed

### How to handle migration to SDK v >= 1.0.0

Major change to this version is that this new one requires `client_ids` in configuration

## Use Cryptr Passport Strategy

### What is the return of Strategy ?

### When token prior to version 3

**Structure**

```typescript
interface Claims {
  aud: string
  cid: string
  exp: number
  iat: number
  ips string // "cryptr" or provider (ex: azure_ad)
  iss: string
  jti: string
  jtt: string
  resource_owner_metadata: any
  sci: string | null // SSO Connection ID
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
- `ips`

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

6. `ips` Represent `cryptr` if you are in magic link process, even it's the SSO provider ex: `azure_ad`

7. `sci` Only set if you are on SSO process, representing the ID of the connection SSO used ex: `shark_academy_Bew14hd05jd`

### When token since version 3

Some changes where applied to JWT structure. Here are some of them

#### Obsolete claims

- `sci`
- `ips`
- `application_metadata`

#### Renamed claims

- `tnt` is now `org`
- `dbs` is now `env`
- `resource_owner_meta` is now `meta_data` bulb see [New claims](#new-claims)

#### New claims

1. The first one is `identities` that retrieve all information on any connection used by the end-user for his authentications. Quick sneak of `identities`` item skeleton

   - `idp_id` connection ID
   - `authenticated_at` unix timestamp of connection
   - `provider` used provider to connect
   - `data` any data from the connection (ex: all SSO attributes if it's SSO)

2. `dp_user_id` is present if Cryptr retrieve the ID from the connection provider

3. `profile` is now the drawer where you can retrieve any known user properties such as `family_name`, `given_name` ...