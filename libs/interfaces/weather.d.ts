export interface CityExistsRequest {
  city: string;
}

export interface CityExistsResponse {
  exists: boolean;
}

export interface GetRequest {
  city: string;
}

export interface DayResponse {
  date: string;
  temperature: string;
  humidity: string;
  icon: string;
  description: string;
}

export interface GetResponse {
  current: DayResponse;
  forecast: DayResponse[];
}

export interface IWeatherService {
  cityExists(request: CityExistsRequest): Promise<CityExistsResponse>;
  get(request: GetRequest): Promise<GetResponse | null>;
}

export interface IWeatherController extends IWeatherService {}

export type WeatherApiResponse = {
  location: {
    name: string;
  };
  current: {
    last_updated: string;
    temp_c: number;
    humidity: number;
    condition: {
      icon: string;
      text: string;
    };
  };
  forecast: {
    forecastday: {
      date: string;
      day: {
        avgtemp_c: number;
        avghumidity: number;
        condition: {
          icon: string;
          text: string;
        };
      };
    }[];
  };
}
