import env from 'env-var';

export const envConfigProvider = {
  PORT: env.get('PORT').required().asPortNumber(),
};
