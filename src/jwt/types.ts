/** Recognized JWT Claims Set members, any other members may also be present. */
export interface JWTPayload {
    /**
     * JWT Issuer
     *
     * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1 RFC7519#section-4.1.1}
     */
    iss?: string

    /**
     * JWT Subject
     *
     * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2 RFC7519#section-4.1.2}
     */
    sub?: string

    /**
     * JWT Audience
     *
     * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3 RFC7519#section-4.1.3}
     */
    aud?: string | string[]

    /**
     * JWT ID
     *
     * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.7 RFC7519#section-4.1.7}
     */
    jti?: string

    /**
     * JWT Not Before
     *
     * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.5 RFC7519#section-4.1.5}
     */
    nbf?: number

    /**
     * JWT Expiration Time
     *
     * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4 RFC7519#section-4.1.4}
     */
    exp?: number

    /**
     * JWT Issued At
     *
     * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6 RFC7519#section-4.1.6}
     */
    iat?: number

    /** Any other JWT Claim Set member. */
    [propName: string]: unknown
}

export class JOSEError extends Error {
    /**
     * A unique error code for the particular error subclass.
     *
     * @ignore
     */
    static get code(): string {
        return 'ERR_JOSE_GENERIC'
    }

    /** A unique error code for this particular error subclass. */
    code = 'ERR_JOSE_GENERIC'

    /** @ignore */
    constructor(message?: string) {
        super(message)
        this.name = this.constructor.name
        // @ts-ignore
        Error.captureStackTrace?.(this, this.constructor)
    }
}

export class JWTInvalid extends JOSEError {
    /** @ignore */
    static get code(): 'ERR_JWT_INVALID' {
        return 'ERR_JWT_INVALID'
    }

    code = 'ERR_JWT_INVALID'
}
