import { SSOSdkErrorMap } from './TYPES'

/** @ignore */
export const SSO_SDK_NOT_INITIALIZED_ERROR: SSOSdkErrorMap = {
  message: 'SSOSdk Not Initialized',
  statusCode: 500,
  errorCode: 'SSO::SSO_SDK_NOT_INITIALIZED'
}

/** @ignore */
export const SSO_TOKEN_EXPIRED_ERROR: SSOSdkErrorMap = {
  message: 'SSO Token Expired',
  statusCode: 400,
  errorCode: 'SSO::SSO_TOKEN_EXPIRED'
}

/** @ignore */
export const REDIS_ERROR: SSOSdkErrorMap = {
  message: 'Error while trying to set data in Redis',
  statusCode: 500,
  errorCode: 'SSO::SSO_REDIS_ERROR'
}
