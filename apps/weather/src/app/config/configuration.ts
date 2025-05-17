export default () => ({
  port: process.env.PORT && parseInt(process.env.PORT, 10),
  weatherApi: {
    key: process.env.WEATHER_API_KEY,
    url: process.env.WEATHER_API_URL
  },
});
