import { RedisSdkConfig } from '@am92/redis'

/**
 * Type definition of SSO Configurations
 *
 * @interface
 */
export interface SSOConfig {
  /**
   * Expiry time of Generated SSO TOKEN
   */
  SSO_TOKEN_EXPIRY_IN_SECS: number
  /**
   * Web App URL for redirection
   */
  WEB_APP_URL: string
}

/**
 * Default SSOSdk Configurations
 */
export const DEFAULT_SSO_CONFIG: SSOConfig = {
  SSO_TOKEN_EXPIRY_IN_SECS: 900,
  WEB_APP_URL: ''
}

/**
 * Type definition of SSOSdk Configurations
 *
 * @interface
 */
export interface SSOSdkConfig {
  /**
   * Overriding RedisSdk Configurations
   */
  REDIS_CONFIG: RedisSdkConfig
  /**
   * SSO Configurations
   */
  SSO_CONFIG: SSOConfig
}

/**
 * Type defination for error map to be passed to SSOSdkError.
 */
export interface SSOSdkErrorMap {
  /**
   * Overriding message string for SSOSdkError instance
   */
  message?: string
  /**
   * Overriding error code string for SSOSdkError instance
   */
  errorCode?: string
  /**
   * Overriding HTTP status code for SSOSdkError instance
   */
  statusCode?: number
}

/**
 * Type definition of input props for [SSOSdk.generate]{@link SSOSdk#generate}
 *
 * @interface
 */
export interface SSOGenerateProp {
  /**
   * Unique customerID for which the redirectionURL is generated
   */
  customerId?: Array<string>
  /**
   * Channel from which the user is getting redirected
   */
  channelId?: string
}

/**
 * Type definition of return value of [SSOSdk.generate]{@link SSOSdk#generate}
 *
 * @interface
 */
export interface SSOGenerateData {
  /**
   * redirection URL with params
   */
  redirectionURL: string
}

/**
 * Type definition of input props for [SSOSdk.validate]{@link SSOSdk#validate}
 *
 * @interface
 */
export interface SSOValidateProp {
  /**
   * SSO Token
   */
  token: string
}

/**
 * Type definition of return value of [SSOSdk.validate]{@link SSOSdk#validate}
 *
 * @interface
 */
export interface SSOValidateData {
  /**
   * Unique customerID for which the redirectionURL is generated
   */
  customerId?: Array<string>
  /**
   * Channel from which the user is getting redirected
   */
  channelId?: string
}

declare global {
  /** @ignore */
  interface Console {
    success?(...data: any[]): void
    fatal?(...data: any[]): void
  }
}
