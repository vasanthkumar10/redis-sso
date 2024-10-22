import {
  REDIS_ERROR,
  SSO_SDK_NOT_INITIALIZED_ERROR,
  SSO_TOKEN_EXPIRED_ERROR
} from './ERRORS'
import {
  SSOConfig,
  SSOGenerateData,
  SSOGenerateProp,
  SSOSdkConfig,
  SSOValidateData,
  SSOValidateProp
} from './TYPES'

import CONFIG from './CONFIG'
import Redis from './Redis'
import { RedisSdkConfig } from '@am92/redis'
import { SSOError } from './SSOError'
import _ from 'lodash'
import crypto from 'crypto'

/**
 * Class to create an SDK which provides SSO Integration
 *
 * @class
 */
export class SSOSdk {
  /** @private */
  #initialized = false

  /** @private */
  #redis: Redis

  /**
   * Redis Configurations used by the OtpSdk instance
   */
  REDIS_CONFIG: RedisSdkConfig
  /**
   * SSO SDK Configurations used by the SSOSdk instance
   */
  SSO_CONFIG: SSOConfig

  /**
   * Creates an instance of OtpSdk.
   *
   * @constructor
   * @param [config]
   */
  constructor(config?: SSOSdkConfig) {
    const thisConfig = _.merge(CONFIG, config)
    const { REDIS_CONFIG, SSO_CONFIG } = thisConfig

    this.#redis = new Redis(REDIS_CONFIG, SSO_CONFIG)
    this.REDIS_CONFIG = this.#redis.REDIS_CONFIG
    this.SSO_CONFIG = SSO_CONFIG

    this.initialize = this.initialize.bind(this)
    this.generate = this.generate.bind(this)
    this.validate = this.validate.bind(this)
  }

  /**
   * Initialize the OtpSdk instance. It internally creates a Redis connection
   *
   * @async
   * @returns
   */
  async initialize(): Promise<void> {
    await this.#redis.initialize()
    this.#initialized = true
  }

  /**
   * Generate SSO Redirection URL
   *
   * @async
   * @param [attrs]
   * @returns
   */
  async generate(attrs: SSOGenerateProp): Promise<SSOGenerateData> {
    // Generate RedirectionURL
    const { redirectionURL } = await this.#shouldGenerate(attrs)

    // Return Generated RedirectionURL
    const data: SSOGenerateData = { redirectionURL }
    return data
  }

  /**
   * Validate a generated SSO token
   *
   * @async
   * @param attrs
   * @returns
   */
  async validate(attrs: SSOValidateProp): Promise<SSOValidateData> {
    // Validate the token
    return await this.#shouldValidate(attrs)
  }

  /** @private */
  async #shouldGenerate(attrs?: SSOGenerateProp): Promise<SSOGenerateData> {
    if (!this.#initialized) {
      throw new SSOError(attrs, SSO_SDK_NOT_INITIALIZED_ERROR)
    }

    const { SSO_CONFIG } = this
    const { SSO_TOKEN_EXPIRY_IN_SECS, WEB_APP_URL } = SSO_CONFIG

    const token = crypto.randomUUID()
    this.#redis.redisSdk
      .setAndExpire(token, JSON.stringify(attrs), SSO_TOKEN_EXPIRY_IN_SECS)
      .catch(error => {
        throw new SSOError(error, REDIS_ERROR)
      })

    const redirectionURL = `${WEB_APP_URL}${token}`
    return { redirectionURL }
  }

  /** @private */
  async #shouldValidate(attrs: SSOValidateProp): Promise<SSOValidateData> {
    if (!this.#initialized) {
      throw new SSOError(attrs, SSO_SDK_NOT_INITIALIZED_ERROR)
    }

    const { token } = attrs

    const ssoData = await this.#redis.redisSdk.get(token)
    // deleting the token to prevent re-validation
    await this.#redis.redisSdk.del(token)

    if (!token || !ssoData) {
      throw new SSOError(attrs, SSO_TOKEN_EXPIRED_ERROR)
    }

    return JSON.parse(ssoData)
  }
}
