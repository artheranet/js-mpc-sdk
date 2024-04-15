import {decoder} from "./buffer_utils";

interface Base64UrlEncode {
    (input: Uint8Array | string): string
}

interface Base64UrlDecode {
    (input: Uint8Array | string): Uint8Array
}

export const decodeBase64 = (encoded: string): Uint8Array => {
    const binary = atob(encoded)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return bytes
}

export const base64UrlDecode = (input: Uint8Array | string) => {
    let encoded = input
    if (encoded instanceof Uint8Array) {
        encoded = decoder.decode(encoded)
    }
    encoded = encoded.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '')
    try {
        return decodeBase64(encoded)
    } catch {
        throw new TypeError('The input to be decoded is not correctly encoded.')
    }
}
