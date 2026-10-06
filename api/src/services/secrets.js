import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: process.env.AWS_REGION || 'ap-southeast-1' });

export async function getDbCredentials() {
  const res = await client.send(new GetSecretValueCommand({
    SecretId: process.env.DB_SECRET_ARN,
  }));
  return JSON.parse(res.SecretString);
}