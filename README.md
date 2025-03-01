# SSOSdk

SSOSdk is a library that provides Single Sign-On (SSO) integration using Redis. It allows generating SSO redirection URLs and validating SSO tokens with built-in Redis-based session management.

## Features

- Initialize SSO SDK with Redis integration
- Generate SSO redirection URLs
- Validate SSO tokens
- Secure token storage with expiration handling

## Owner

Developed and maintained by Vasizebron Technologies.

## Installation

```sh
npm install @your-org/ssosdk
```

## Usage

### Import the SSOSdk

```typescript
import { SSOSdk } from '@your-org/ssosdk'
```

### Initialize the SDK

```typescript
const ssoSdk = new SSOSdk({
  REDIS_CONFIG: {
    /* Redis configurations */
  },
  SSO_CONFIG: {
    SSO_TOKEN_EXPIRY_IN_SECS: 3600,
    WEB_APP_URL: 'https://your-app.com/sso/'
  }
})

await ssoSdk.initialize()
```

### Generate SSO Redirection URL

```typescript
const { redirectionURL } = await ssoSdk.generate({
  userId: '12345',
  redirectUri: 'https://your-app.com/dashboard'
})
console.log('SSO URL:', redirectionURL)
```

### Validate SSO Token

```typescript
const userData = await ssoSdk.validate({ token: 'generated-token' })
console.log('User Data:', userData)
```

## API Reference

### `initialize()`

Initializes the SSO SDK instance and establishes a Redis connection.

```typescript
await ssoSdk.initialize()
```

### `generate(attrs: SSOGenerateProp): Promise<SSOGenerateData>`

Generates an SSO redirection URL with a unique token stored in Redis.

```typescript
const { redirectionURL } = await ssoSdk.generate({ userId: '12345' })
```

### `validate(attrs: SSOValidateProp): Promise<SSOValidateData>`

Validates an SSO token and retrieves the associated user data.

```typescript
const userData = await ssoSdk.validate({ token: 'generated-token' })
```

## Error Handling

The SDK throws `SSOError` in case of errors. Common error types:

- `SSO_SDK_NOT_INITIALIZED_ERROR`: SDK not initialized before calling methods.
- `REDIS_ERROR`: Redis operation failure.
- `SSO_TOKEN_EXPIRED_ERROR`: Invalid or expired SSO token.

## 🎯 License

This project is licensed under the **MIT License**.

---

## 📬 Contact

- **Author:** Vasanthkumar
- **GitHub:** [@vasanthkumar10](https://github.com/vasanthkumar10)
- **Email:** vasizebron10@gmail.com
