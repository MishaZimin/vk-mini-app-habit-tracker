import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';
export const DEFAULT_VIEW = 'default_view';

export const DEFAULT_VIEW_PANELS = {
  HABITS_LIST: 'habits',
  HABIT_DETAIL: 'habit/:id',
  HABIT_CREATE: 'habit/create',
  PERSIK: 'persik',
  HOME: 'home',
} as const;

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      createPanel(DEFAULT_VIEW_PANELS.HABITS_LIST, '/', []),
      createPanel(DEFAULT_VIEW_PANELS.HABIT_DETAIL, '/habit/:id', []),
      createPanel(DEFAULT_VIEW_PANELS.HABIT_CREATE, '/habit/create', []),
      createPanel(DEFAULT_VIEW_PANELS.PERSIK, '/persik', []),
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
