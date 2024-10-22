import { SERVICE } from './CONFIG'
import { SSOSdkErrorMap } from './TYPES'

/** @ignore */
const DEFAULT_ERROR_MSG = 'SSO Error'
/** @ignore */
const DEFAULT_ERROR_STATUS_CODE = 500
/** @ignore */
const DEFAULT_ERROR_CODE = 'SSO::GENERIC'

/**
 * Error class whose instance is thrown in case of any error.
 *
 * @class
 * @typedef {SSOError}
 * @extends {Error}
 */
export class SSOError extends Error {
  /**
   * Flag to identify if error is a custom error.
   */
  readonly _isCustomError = true
  /**
   * Flag to identify if error is a SSOError.
   */
  readonly _isSSOError = true
  /**
   * Node project from which Error is thrown.
   */
  readonly service: string
  /**
   * Error's message string.
   */
  message: string
  /**
   * HTTP status code associated with the error.
   */
  statusCode: number
  /**
   * Error Code.
   */
  errorCode: string
  /**
   * Error object.
   */
  error?: any
  /**
   * Creates an instance of SSOError.
   *
   * @constructor
   * @param [e] Any Error instance to wrap with SSOError.
   * @param [eMap] SSOSdkErrorMap to rewrap error for better understanding.
   */
  constructor(e?: any, eMap?: SSOSdkErrorMap) {
    super()

    this.service = SERVICE
    this.message = eMap?.message || e?.message || DEFAULT_ERROR_MSG
    this.statusCode = eMap?.statusCode || DEFAULT_ERROR_STATUS_CODE
    this.errorCode = eMap?.errorCode || e?.code || DEFAULT_ERROR_CODE
    this.error = e
  }
}
