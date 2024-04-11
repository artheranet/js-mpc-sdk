import {ARTHERA_TESTNET_ID, ArtheraLogin} from "../src";
import {expect} from "chai";

// get your id token from https://developers.google.com/oauthplayground
const GOOGLE_ID_TOKEN= "FILL_ME";
const GOOGLE_CLIENT_ID = "407408718192.apps.googleusercontent.com";

describe("Sign", () => {
    it("sign message with google login", async () => {
        const login = new ArtheraLogin(ARTHERA_TESTNET_ID);
        const wallet = await login.loginWithGoogleToken(GOOGLE_CLIENT_ID, GOOGLE_ID_TOKEN);
        const signer = login.getSigner();
        const signature = await signer.signMessage("hello");
        expect(signature).to.be.a("string");
    });

    it("send transaction with google login", async () => {
        const login = new ArtheraLogin(10243);
        const wallet = await login.loginWithGoogleToken(GOOGLE_CLIENT_ID, GOOGLE_ID_TOKEN);
        // transfer 0.1 AA to self
        await login.getSigner().sendTransaction({
            to: wallet,
            value: "100000000000000000"
        });
    });

    it("send transaction with otp login", async () => {
        const login = new ArtheraLogin(ARTHERA_TESTNET_ID);
        const otp = await login.getLoginOtp("otpuser1@example.com");
        const wallet = await login.loginWithOtp("otpuser1@example.com", otp);
        console.log(wallet);
        // transfer 0.1 AA to self
        await login.getSigner().sendTransaction({
            to: wallet,
            value: "100000000000000000"
        });
    });
});
