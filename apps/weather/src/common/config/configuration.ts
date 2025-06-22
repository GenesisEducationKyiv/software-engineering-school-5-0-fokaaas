export default () => ({
  port: process.env.PORT,
  weatherApi: {
    key: process.env.WEATHER_API_KEY,
    url: process.env.WEATHER_API_URL,
  },
  visualCrossing: {
    key: process.env.VISUAL_CROSSING_KEY,
    url: process.env.VISUAL_CROSSING_URL,
    iconUrl: process.env.VISUAL_CROSSING_ICON_URL,
  },
});
