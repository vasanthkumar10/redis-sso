import { IntConfigKeys, IntConfigs, SSOSdkEnvConfig } from './TYPES_INTERNAL'

import { DEFAULT_SSO_CONFIG } from './TYPES'
import { RedisSdkConfig } from '@am92/redis'

/** @ignore */
const {
  npm_package_name: pkgName = '',
  npm_package_version: pkgVersion = '',

  SSO_DEDICATED_REDIS = 'false',
  SSO_REDIS_AUTH_ENABLED = 'false',
  SSO_REDIS_HOST = '',
  SSO_REDIS_PORT = '6379',
  SSO_REDIS_AUTH = '',
  SSO_REDIS_KEY_PREFIX = '',

  SSO_TOKEN_EXPIRY_IN_SECS = DEFAULT_SSO_CONFIG.SSO_TOKEN_EXPIRY_IN_SECS.toString(),
  WEB_APP_URL = DEFAULT_SSO_CONFIG.WEB_APP_URL.toString()
} = process.env

/** @ignore */
export const SERVICE = `${pkgName}@${pkgVersion}`

/** @ignore */
const DEDICATED_REDIS = SSO_DEDICATED_REDIS === 'true'

/** @ignore */
const DEDICATED_REDIS_AUTH_ENABLED = SSO_REDIS_AUTH_ENABLED === 'true'

/** @ignore */
let REDIS_CONNECTION_CONFIG: RedisSdkConfig['CONNECTION_CONFIG'] = {}

/** @ignore */
const REQUIRED_CONFIG: Array<string> = []

/** @ignore */
const MISSING_CONFIGS: Array<string> = []

/** @ignore */
const INT_ENV: IntConfigs<string> = {
  SSO_REDIS_PORT,
  SSO_TOKEN_EXPIRY_IN_SECS
}

/** @ignore */
const INT_CONFIG: IntConfigs<number> = {}

/** @ignore */
const INVALID_INT_CONFIG: IntConfigs<string> = {}

if (DEDICATED_REDIS) {
  REQUIRED_CONFIG.push('SSO_REDIS_HOST')
  REQUIRED_CONFIG.push('SSO_REDIS_PORT')

  if (DEDICATED_REDIS_AUTH_ENABLED) {
    REQUIRED_CONFIG.push('SSO_REDIS_AUTH')
  }

  REQUIRED_CONFIG.forEach(function (key) {
    if (!process.env[key]) {
      MISSING_CONFIGS.push(key)
    }
  })

  if (MISSING_CONFIGS.length) {
    const logFunc = console.fatal || console.error
    logFunc(
      `[${SERVICE} SSO] SSO Sdk Configs Missing: ${MISSING_CONFIGS.join(', ')}`
    )
    process.exit(1)
  }
} else {
  console.warn(
    `[${SERVICE} SSO] SSO Sdk Config SSO_DEDICATED_REDIS set to false. Ensure REDIS_ENABLED is set to true`
  )
}

Object.keys(INT_ENV).forEach(key => {
  const configKey = key as IntConfigKeys
  const value = INT_ENV[configKey] || ''
  const intValue = parseInt(value, 10)

  if (isNaN(intValue)) {
    INVALID_INT_CONFIG[configKey] = value
  } else {
    INT_CONFIG[configKey] = intValue
  }
})

if (Object.keys(INVALID_INT_CONFIG).length) {
  const logFunc = console.fatal || console.error
  logFunc(
    `[${SERVICE} SSO] Invalid SSO Sdk Integer Configs:`,
    INVALID_INT_CONFIG
  )
  process.exit(1)
}

if (DEDICATED_REDIS) {
  REDIS_CONNECTION_CONFIG = {
    socket: {
      host: SSO_REDIS_HOST,
      port: INT_CONFIG.SSO_REDIS_PORT,
      tls: DEDICATED_REDIS_AUTH_ENABLED
    },
    password: DEDICATED_REDIS_AUTH_ENABLED ? SSO_REDIS_AUTH : undefined
  }
}

/** @ignore */
const CONFIG: SSOSdkEnvConfig = {
  DEDICATED_REDIS,

  REDIS_CONFIG: {
    CONNECTION_CONFIG: REDIS_CONNECTION_CONFIG,
    KEY_PREFIX: SSO_REDIS_KEY_PREFIX
  },

  SSO_CONFIG: {
    SSO_TOKEN_EXPIRY_IN_SECS:
      INT_CONFIG.SSO_TOKEN_EXPIRY_IN_SECS ||
      DEFAULT_SSO_CONFIG.SSO_TOKEN_EXPIRY_IN_SECS,
    WEB_APP_URL: DEFAULT_SSO_CONFIG.WEB_APP_URL
  }
}

export default CONFIG
