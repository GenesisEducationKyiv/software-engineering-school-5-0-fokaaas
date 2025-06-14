export default () => ({
  port: process.env.PORT,
  frontBaseUrl: process.env.FRONT_BASE_URL,
  smtp: {
    host: process.env.SMTP_HOST,
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
  },
});
