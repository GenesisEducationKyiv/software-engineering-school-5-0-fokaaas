export type CityExistsRequest = {
  city: string;
};

export type CityExistsResponse = {
  exists: boolean;
};

export type GetWeatherRequest = {
  city: string;
};

export type DayResponse = {
  date: string;
  temperature: string;
  humidity: string;
  icon: string;
  description: string;
};

export type GetWeatherResponse = {
  current: DayResponse;
  forecast: DayResponse[];
};

export interface IWeatherService {
  cityExists(request: CityExistsRequest): Promise<CityExistsResponse>;
  get(request: GetWeatherRequest): Promise<GetWeatherResponse>;
}

export type IWeatherController = IWeatherService;
