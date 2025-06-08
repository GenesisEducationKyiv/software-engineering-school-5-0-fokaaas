export type CityExistsRequest = {
  city: string;
};

export type CityExistsResponse = {
  exists: boolean;
};

export type GetRequest = {
  city: string;
};

export type DayResponse = {
  date: string;
  temperature: string;
  humidity: string;
  icon: string;
  description: string;
};

export type GetResponse = {
  current: DayResponse;
  forecast: DayResponse[];
};

export interface IWeatherService {
  cityExists(request: CityExistsRequest): Promise<CityExistsResponse>;
  get(request: GetRequest): Promise<GetResponse>;
}

export type IWeatherController = IWeatherService;

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
};
