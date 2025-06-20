export default () => ({
  port: process.env.PORT,
  weatherApi: {
    key: process.env.WEATHER_API_KEY,
    url: process.env.WEATHER_API_URL,
  },
});
