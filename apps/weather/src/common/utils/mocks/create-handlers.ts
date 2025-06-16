import { http, HttpResponse } from 'msw';

export const createHandlers = (baseUrl: string) => [
  http.get(`${baseUrl}/forecast.json`, ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get('q');

    if (city === 'Kyiv') {
      return HttpResponse.json(
        {
          location: {
            name: 'Kyiv',
          },
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
        { status: 200 }
      );
    }
    return HttpResponse.json(
      {
        error: {
          code: 1006,
          message: 'No matching location found.',
        },
      },
      { status: 400 }
    );
  }),
];
