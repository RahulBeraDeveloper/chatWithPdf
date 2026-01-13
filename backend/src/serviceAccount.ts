// backend/config/serviceAccount.ts

const serviceAccount = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID!,
  client_email: process.env.GOOGLE_CLIENT_EMAIL!,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

export default serviceAccount;
