require("dotenv").config();
const SellingPartnerAPI = require("amazon-sp-api");
const AWS = require("aws-sdk");

(async () => {
  try {
    console.log(process, "process");

    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.STS_REGION,
    });

    const params = {
      DurationSeconds: 3600, // duration of the session token, in seconds
      RoleArn: process.env.AWS_SELLING_PARTNER_ROLE, // role ARN to assume
      RoleSessionName: process.env.ROLE_SESSION_NAME, // name for the session
    };

    const sts = new AWS.STS();

    const data = await sts.assumeRole(params).promise();
    const credentials = data.Credentials;

    let sellingPartner = new SellingPartnerAPI({
      region: "na",
      refresh_token: process.env.SELLING_PARTNER_REFRESH_TOKEN,
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID:
          process.env.SELLING_PARTNER_APP_CLIENT_ID,
        SELLING_PARTNER_APP_CLIENT_SECRET:
          process.env.SELLING_PARTNER_APP_CLIENT_SECRET,
        AWS_ACCESS_KEY_ID: credentials.AccessKeyId,
        AWS_SECRET_ACCESS_KEY: credentials.SecretAccessKey,
        AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE,
        AWS_SESSION_TOKEN: credentials.SessionToken,
      },
    });

    let res = await sellingPartner.callAPI({
      operation: "getOrders",
    });

    console.log(res, "res");
  } catch (e) {
    console.log(e);
  }
})();

// const axios = require("axios");
// const qs = require("qs");

// const SCOPE = "sellingpartnerapi::orders";

// const getOrders = async () => {
//   try {
//     const res = await axios.post("https://api.amazon.com/auth/o2/token", {
//       grant_type: "refresh_token",
//       client_id: clientId,
//       client_secret: clientSecret,
//       refresh_token: refreshToken,
//     });
//     const access_token = res.data.access_token;

//     const requestData = {
//       client_id: clientId,
//       scope: SCOPE,
//       grant_type: "client_credentials",
//     };

//     const resRdt = await axios.post(
//       "https://sellingpartnerapi-na.amazon.com/tokens/2021-03-01/restrictedDataToken",
//       qs.stringify(requestData),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
//           Authorization: `Basic ${Buffer.from(
//             `${clientId}:${clientSecret}`
//           ).toString("base64")}`,
//           "Amazon-Advertising-API-ClientId": clientId,
//           "Amazon-Advertising-API-Scope": SCOPE,
//           "Amazon-Advertising-API-Scope": SCOPE,
//           "Amazon-Advertising-API-Scope": SCOPE,
//           "Amazon-Advertising-API-Scope": SCOPE,
//         },
//       }
//     );

//     console.log(resRdt, "here");

//     // const endpoint = `https://sellingpartnerapi.${marketplace_id}.amazon.com`;

//     // const response = await axios.get(
//     //   `https://sellingpartnerapi-na.amazon.com/orders/v0/orders?MarketplaceIds=ATVPDKIKX0DER&CreatedAfter=20230502T193504.852+0300`,
//     //   {
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       Authorization: `Bearer ${access_token}`,
//     //     },
//     //   }
//     // );

//     // const orders = response.data._embedded.orders;
//     // console.log(`Number of orders: ${orders.length}`);
//     return orders;
//   } catch (error) {
//     console.error(error);
//   }
// };

// getOrders();

// const AWS = require("aws-sdk");

// AWS.config.update({
//   region: "us-east-1",
// });

// const sts = new AWS.STS();

// const params = {
//   DurationSeconds: 3600, // duration of the session token, in seconds
// };

// async function getTemporaryCredentials() {
//   try {
//     const data = await sts.assumeRole(params).promise();
//     const credentials = data.Credentials;
//     const sessionToken = credentials.SessionToken;

//     console.log("here");

//     // use temporary security credentials and session token for API requests
//   } catch (err) {
//     console.log(err);
//   }
// }

// getTemporaryCredentials();
