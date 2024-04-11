import {Signer, TypedDataDomain, TypedDataField, TypedDataSigner} from "@ethersproject/abstract-signer";
import {Provider, TransactionRequest} from "@ethersproject/abstract-provider";
import {Bytes, BytesLike, hexlify, hexZeroPad, joinSignature, Signature, splitSignature} from "@ethersproject/bytes";
import {_TypedDataEncoder, hashMessage} from "@ethersproject/hash";
import {resolveProperties} from "@ethersproject/properties";
import {getAddress} from "@ethersproject/address";
import {serialize, UnsignedTransaction} from "@ethersproject/transactions";
import {keccak256} from "@ethersproject/keccak256";
import {MPC_AUTH_ENDPOINT} from "./constants";

export class ArtheraSigner extends Signer implements TypedDataSigner {
    wallet: string;
    publicKey: string;
    userId: string;
    provider?: Provider;

    constructor(userId: string, wallet: string, publicKey: string, provider?: Provider) {
        super();
        this.userId = userId;
        this.provider = provider;
        this.wallet = wallet;
        this.publicKey = publicKey;
    }

    override async getAddress(): Promise<string> {
        return this.wallet;
    }

    connect(provider: Provider): ArtheraSigner {
        this.provider = provider;
        return this;
    }

    override async signMessage(message: Bytes | string): Promise<string> {
        return joinSignature(await this.signDigest(hashMessage(message)));
    }

    async signTransaction(transaction: TransactionRequest): Promise<string> {
        return resolveProperties(transaction).then(async (tx) => {
            if (tx.from != null) {
                if (getAddress(tx.from) !== this.wallet) {
                    throw new Error(
                        `transaction from address mismatch (from:${tx.from} address:${this.wallet})`
                    );
                }
                delete tx.from;
            }
            const signature = await this.signDigest(
                keccak256(serialize(<UnsignedTransaction>tx))
            );
            return serialize(<UnsignedTransaction>tx, signature);
        });
    }

    public async signDigest(data: BytesLike): Promise<Signature> {
        const dataHex = hexlify(data);
        const sign = await this.sign(dataHex.slice(2));
        const r = sign.slice(0, 64);
        const s = sign.slice(64, 128);
        const recid = sign.slice(128, 130) == "00" ? 0 : 1;

        return splitSignature({
            recoveryParam: recid,
            r: hexZeroPad(`0x${r}`, 32),
            s: hexZeroPad(`0x${s}`, 32),
        });
    }

    async sign(messageHash: string): Promise<string> {
        const resp = await fetch(`${MPC_AUTH_ENDPOINT}/v1/sign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: this.userId,
                public_key: this.publicKey,
                message: messageHash,
            }),
        });

        if (resp.status !== 200) {
            throw new Error(`Signing error: ${resp.status}`);
        }

        const jsonResponse = await resp.json();
        return jsonResponse.signature;
    }

    async _signTypedData(
        domain: TypedDataDomain,
        types: Record<string, Array<TypedDataField>>,
        value: Record<string, any>
    ): Promise<string> {
        // Populate any ENS names
        const populated = await _TypedDataEncoder.resolveNames(
            domain,
            types,
            value,
            //@ts-ignore
            (name: string) => {
                if (this.provider == null) {
                    throw new Error("cannot resolve ENS names without a provider");
                }
                return this.provider.resolveName(name);
            }
        );

        return joinSignature(
            await this.signDigest(
                _TypedDataEncoder.hash(populated.domain, types, populated.value)
            )
        );
    }
}
