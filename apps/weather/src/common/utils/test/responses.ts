export default {
  weatherApiSuccess: {
    current: {
      last_updated: '2025-06-15 23:00',
      temp_c: 21.5,
      humidity: 75,
      condition: {
        icon: '//cdn.weatherapi.com/weather/64x64/night/116.png',
        text: 'Partly cloudy',
      },
    },
    forecast: {
      forecastday: [
        {
          date: '2025-06-15',
          day: {
            avgtemp_c: 22.0,
            avghumidity: 70,
            condition: {
              icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
              text: 'Partly cloudy',
            },
          },
        },
      ],
    },
  },
  weatherApiError: {
    error: {
      code: 1006,
      message: 'No matching location found.',
    },
  },
  weatherApiUnexpectedError: {
    error: {
      code: 100,
      message: 'Some unexpected error occurred.',
    },
  },
  visualCrossingSuccess: {
    currentConditions: {
      datetime: '23:00',
      temp: 21.5,
      humidity: 75,
      conditions: 'Partly cloudy',
      icon: 'partly-cloudy-night',
    },
    days: [
      {
        datetime: '2025-06-15',
        temp: 22.0,
        humidity: 70,
        conditions: 'Partly cloudy',
        icon: 'partly-cloudy-day',
      },
    ],
  },
  visualCrossingError: 'Bad API Request:Invalid location parameter value',
  visualCrossingUnexpectedError: 'Some unexpected error occurred.',
};
