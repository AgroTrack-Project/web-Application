/** DTO mínimo de parcela (bounded context Farming vía API). */
export interface PlotRefDto {
  id: string;
  user_id: string;
  name: string;
  status: string;
}
