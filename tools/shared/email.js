import { GraphQLClient, gql } from "graphql-request";
const mailjet = require("node-mailjet").connect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_API_SECRET
);

const graphQLClient = new GraphQLClient(process.env.GRAPHQL_API_URL, {
  headers: {
    "x-api-key": `${process.env.GRAPHQL_API_KEY}`,
  },
});

const getUserEmailQuery = gql(`
query getUserEmail($Nickname: String!) {
    getUserEmail(Nickname: $Nickname)
}
`);

const getUserEmailVariables = {
  Nickname: process.env.USER_ID,
};

const userEmail = await graphQLClient
  .request(getUserEmailQuery, getUserEmailVariables)
  .then((response) => response.getUserEmail)
  .catch((error) => {
    core.setFailed(
      `GraphQL failed to fetch the users email with ID# ${process.env.USER_ID}: ${error}`
    );
  });

await mailjet
  .post("send", {
    version: "v3.1",
  })
  .request({
    Messages: [
      {
        From: {
          Email: "info@huntr.dev",
          Name: "the huntr team",
        },
        To: [
          {
            Email: userEmail,
            Name: userEmail,
          },
        ],
        TemplateID: "TODO: template ID",
        TemplateLanguage: true,
        Variables: "TODO: required variables",
      },
    ],
  });
