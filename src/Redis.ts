import { RedisSdk, RedisSdkConfig } from '@am92/redis'

import { SSOConfig } from './TYPES'

/** @internal */
export default class Redis {
  redisSdk: RedisSdk
  REDIS_CONFIG: RedisSdkConfig
  SSO_CONFIG: SSOConfig

  constructor(REDIS_CONFIG: RedisSdkConfig, SSO_CONFIG: SSOConfig) {
    this.redisSdk = new RedisSdk(REDIS_CONFIG)
    this.REDIS_CONFIG = this.redisSdk.CONFIG
    this.SSO_CONFIG = SSO_CONFIG

    this.initialize = this.initialize.bind(this)
  }

  async initialize(): Promise<void> {
    await this.redisSdk.connect()
  }
}
