type SslOptions = boolean | { rejectUnauthorized: boolean };

export const getSsl = (): SslOptions => {
  return process.env.DYNO ? { rejectUnauthorized: false } : false;
};
