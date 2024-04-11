import {ArtheraLogin} from "../src";
import {ARTHERA_TESTNET_ID} from "../src";

const GOOGLE_CLIENT_ID = "407408718192.apps.googleusercontent.com";
const GOOGLE_ID_TOKEN= "FILL_ME";

describe("Login", () => {
  it("login with google", async () => {
    const login = new ArtheraLogin(ARTHERA_TESTNET_ID);
    const wallet = await login.loginWithGoogleToken(GOOGLE_CLIENT_ID, GOOGLE_ID_TOKEN);
    console.log(wallet);
  });

  it ("send and verify login otp", async () => {
    const login = new ArtheraLogin(ARTHERA_TESTNET_ID);
    const otp = await login.getLoginOtp("otpuser1@example.com");
    const wallet = await login.loginWithOtp("otpuser1@example.com", otp);
    console.log(wallet);
  });
});
