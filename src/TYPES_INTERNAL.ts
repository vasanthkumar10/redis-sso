import { SSOSdkConfig } from './TYPES'

/** @ignore */
export interface SSOSdkEnvConfig extends SSOSdkConfig {
  DEDICATED_REDIS: boolean
}

/** @ignore */
export type IntConfigKeys = 'SSO_REDIS_PORT' | 'SSO_TOKEN_EXPIRY_IN_SECS'

/** @ignore */
export type IntConfigs<T> = {
  [key in IntConfigKeys]?: T
}
