export interface ClimateResponse {

  weather: {
    description: string;
    icon: string;
  }[];

  main: {
    temp: number;
    temp_min: number;
    humidity: number;
  };

  wind: {
    speed: number;
  };

  sys: {
    country: string;
  };

  name: string;
}
