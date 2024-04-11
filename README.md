# Arthera MPC SDK

The Arthera Multi-Party Computation SDK allows developers to work with Arthera's distributed login & signing infrastructure.

The SDK provides one central class to interact with the MPC network: `ArtheraLogin`.

## Google Login

```typescript
import { ARTHERA_TESTNET_ID, ArtheraLogin } from '@artherachain/mpc-sdk';

// specify the Arthera chain id
const sdk = new ArtheraLogin(ARTHERA_TESTNET_ID);

// create your own Google OAuth 2.0 Client IDs at https://console.developers.google.com/apis/credentials
// to get an OAuth 2.0 ID Token from Google you can use a library like @react-oauth/google
const wallet = await sdk.loginWithGoogleToken(YOUR_GOOGLE_CLIENT_ID, GOOGLE_OAUTH2_ID_TOKEN);

// once a successful login has been performed, you can use the SDK to interact with the Arthera network
const receipt = await sdk.getSigner().sendTransaction({
    to: "0xB7a04a770ec64B41C7f28CaF359dd8b9f74f61C3",
    value: "100000000000000000"
});
```

## Custom email login

```typescript
import { ARTHERA_TESTNET_ID, ArtheraLogin } from '@artherachain/mpc-sdk';

// specify the Arthera chain id
const sdk = new ArtheraLogin(ARTHERA_TESTNET_ID);

// get the `otp` code to send to the user
const otp = await login.getLoginOtp("user@example.com");

// send the `otp` code to the user

// have the user enter the OTP code in a form and submit it to get the wallet
const wallet = await login.loginWithOtp("user@example.com", otp);

// once a successful login has been performed, you can use the SDK to interact with the Arthera network
const receipt = await sdk.getSigner().sendTransaction({
    to: "0xB7a04a770ec64B41C7f28CaF359dd8b9f74f61C3",
    value: "100000000000000000"
});
```
