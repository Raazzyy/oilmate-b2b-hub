export interface City {
  id: string;
  name: string;
  description: string;
}

export const cities: City[] = [
  { id: "vladivostok", name: "Владивосток", description: "Пункт выдачи заказов и доставка по всему Приморскому краю" },
  { id: "other", name: "Другой город", description: "Доставка заказов через транспортную компанию" },
];
