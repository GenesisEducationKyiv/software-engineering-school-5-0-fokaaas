export default () => ({
  port: process.env.PORT && parseInt(process.env.PORT, 10),
  weather: {
    host: process.env.WEATHER_HOST,
    port: process.env.WEATHER_PORT && parseInt(process.env.WEATHER_PORT, 10),
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT && parseInt(process.env.EMAIL_PORT, 10),
  },
  subscription: {
    host: process.env.SUBSCRIPTION_HOST,
    port: process.env.SUBSCRIPTION_PORT && parseInt(process.env.SUBSCRIPTION_PORT, 10),
  }
});
