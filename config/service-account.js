import dotenv from "dotenv";

dotenv.config();
const { PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY, PRIVATE_KEY_ID, CLIENT_ID } =
  process.env;

export const serviceAccount = {
  type: "service_account",
  project_id: PROJECT_ID,
  private_key_id: PRIVATE_KEY_ID,
  private_key: PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: CLIENT_EMAIL,
  client_id: CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/french%40french-453912.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};
