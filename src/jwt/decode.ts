import {JWTInvalid, JWTPayload} from "./types";
import isObject from "./util";
import {decoder} from "./buffer_utils";
import {base64UrlDecode} from "./base64url";

/**
 * Decodes a signed JSON Web Token payload. This does not validate the JWT Claims Set types or
 * values. This does not validate the JWS Signature. For a proper Signed JWT Claims Set validation
 * and JWS signature verification use `jose.jwtVerify()`. For an encrypted JWT Claims Set validation
 * and JWE decryption use `jose.jwtDecrypt()`.
 *
 * @example
 *
 * ```js
 * const claims = jose.decodeJwt(token)
 * console.log(claims)
 * ```
 *
 * @param jwt JWT token in compact JWS serialization.
 */
export function decodeJwt<PayloadType = JWTPayload>(jwt: string): PayloadType & JWTPayload {
    if (typeof jwt !== 'string')
        throw new JWTInvalid('JWTs must use Compact JWS serialization, JWT must be a string')

    const { 1: payload, length } = jwt.split('.')

    if (length === 5) throw new JWTInvalid('Only JWTs using Compact JWS serialization can be decoded')
    if (length !== 3) throw new JWTInvalid('Invalid JWT')
    if (!payload) throw new JWTInvalid('JWTs must contain a payload')

    let decoded: Uint8Array
    try {
        decoded = base64UrlDecode(payload)
    } catch {
        throw new JWTInvalid('Failed to base64url decode the payload')
    }

    let result: unknown
    try {
        result = JSON.parse(decoder.decode(decoded))
    } catch {
        throw new JWTInvalid('Failed to parse the decoded payload as JSON')
    }

    if (!isObject<PayloadType & JWTPayload>(result)) throw new JWTInvalid('Invalid JWT Claims Set')

    return result
}
