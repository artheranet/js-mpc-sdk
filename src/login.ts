import {JsonRpcProvider} from "@ethersproject/providers";
import {ARTHERA_NETWORK_DETAILS, MPC_AUTH_ENDPOINT} from "./constants";
import {computeAddress} from "@ethersproject/transactions";
import {ArtheraSigner} from "./signer";
import {decodeJwt} from "jose";

export enum AuthMethod {
    GOOGLE = "google",
    OTP = "otp",
}

export class ArtheraLogin {
    private provider: JsonRpcProvider;
    private wallet: string;
    private publicKey: string;
    private userId: string;
    private hashedUserId: string;
    private token: string;
    private clientId: string;
    private otpSeed: number;
    private authMethod: AuthMethod;

    constructor(chainId: number) {
        this.provider = new JsonRpcProvider(ARTHERA_NETWORK_DETAILS[chainId].rpcUrls[0], ARTHERA_NETWORK_DETAILS[chainId]);
    }

    async loginWithGoogleToken (client_id: string, id_token: string): Promise<string> {
        const decodedToken = decodeJwt(id_token);
        const user_id = decodedToken.sub;

        let resp = await fetch(`${MPC_AUTH_ENDPOINT}/v1/login_google_jwt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id,
                token: id_token,
                client_id,
            }),
        });

        if (resp.status !== 200) {
            throw new Error(`Error logging in: ${resp.status}`);
        }

        const jsonResponse = await resp.json();
        const pubkey: string = jsonResponse.public_key;

        this.publicKey = pubkey;
        this.wallet = computeAddress(`0x${pubkey}`);
        this.userId = user_id;
        this.clientId = client_id;
        this.token = id_token;
        this.authMethod = AuthMethod.GOOGLE;

        return this.wallet;
    }

    async getLoginOtp(user_id: string): Promise<string> {
        this.otpSeed = new Date().getTime();
        let resp = await fetch(`${MPC_AUTH_ENDPOINT}/v1/get_otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                seed: this.otpSeed,
                user_id
            }),
        });

        if (resp.status !== 200) {
            throw new Error(`Error retrieving login OTP: ${resp.status}`);
        }

        const jsonResponse = await resp.json();
        return jsonResponse.otp;
    }

    async loginWithOtp(user_id: string, otp: string): Promise<string> {
        let resp = await fetch(`${MPC_AUTH_ENDPOINT}/v1/login_otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id,
                otp,
                seed: this.otpSeed,
            }),
        });

        if (resp.status !== 200) {
            throw new Error(`Error logging in: ${resp.status}`);
        }

        const jsonResponse = await resp.json();
        const pubkey: string = jsonResponse.public_key;

        this.publicKey = pubkey;
        this.wallet = computeAddress(`0x${pubkey}`);
        this.userId = user_id;
        this.hashedUserId = jsonResponse.hashed_user_id;
        this.authMethod = AuthMethod.OTP;

        return this.wallet;
    }

    getSigner(): ArtheraSigner {
        const user_id = this.authMethod === AuthMethod.OTP ? this.hashedUserId : this.userId;
        return new ArtheraSigner(user_id, this.wallet, this.publicKey, this.provider);
    }

    logout() {
        this.userId = null;
        this.wallet = null;
        this.publicKey = null;
    }

    getWallet(): string {
        return this.wallet;
    }

    getUserId(): string {
        return this.userId;
    }

    getPublicKey(): string {
        return this.publicKey;
    }

    getAuthMethod(): AuthMethod {
        return this.authMethod;
    }
}
