export const LOGIN_PATH = "/login";

export const CATEGORY_LABELS: Record<string, string> = {
  iphone: "iPhone",
  mac: "Mac",
  ipad: "iPad",
  watch: "Watch",
  airpods: "AirPods",
  accessories: "Аксессуары",
};

export const CATEGORIES = [
  "iphone",
  "mac",
  "ipad",
  "watch",
  "airpods",
  "accessories",
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: "Новый",
  paid: "Оплачен",
  shipped: "В пути",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

import { Delivery } from "@contracts/constants";

export const DELIVERY_COST = Delivery.courierCost;
export const FREE_DELIVERY_FROM = Delivery.freeCourierFrom;
