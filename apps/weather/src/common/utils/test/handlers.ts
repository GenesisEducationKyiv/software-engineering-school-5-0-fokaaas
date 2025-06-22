import { http, HttpResponse } from 'msw';
import configuration from '../../config/configuration';
import responses from './responses';

const { visualCrossing, weatherApi } = configuration();

export default [
  http.get(`${weatherApi.url}/forecast.json`, ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get('q');

    if (city === 'Kyiv') {
      return HttpResponse.json(responses.weatherApiSuccess, {
        status: 200,
      });
    } else if (city === 'Washington') {
      return HttpResponse.json(responses.weatherApiUnexpectedError, {
        status: 500,
      });
    }
    return HttpResponse.json(responses.weatherApiError, { status: 400 });
  }),
  http.get(`${visualCrossing.url}/kyiv/next6days`, () => {
    return HttpResponse.json(responses.visualCrossingSuccess, { status: 200 });
  }),
  http.get(`${visualCrossing.url}/nonExistingCity/next6days`, () => {
    return HttpResponse.json(responses.visualCrossingError, { status: 400 });
  }),
  http.get(`${visualCrossing.url}/washington/next6days`, () => {
    return HttpResponse.json(responses.visualCrossingUnexpectedError, {
      status: 500,
    });
  }),
];
