import { TopLevelCategory } from "src/top-page/top-page.model";

type routeMapType = Record<TopLevelCategory, string>;

export const CATEGORY_URL: routeMapType = {
  0: '/courses',
  1: '/servises',
  2: '/books',
  3: '/products',
};