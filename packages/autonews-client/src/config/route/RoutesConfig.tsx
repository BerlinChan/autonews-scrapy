import { lazy } from 'react';
import { RouteType } from 'src/shared/models/routeModels';

const RoutesConfig: RouteType = {
  publicRoutes: [
    {
      path: '/',
      isPublic: true,
      component: lazy((): any => import('src/modules/monitor/Monitor')),
    },
    {
      path: '/pastInquiry',
      isPublic: true,
      component: lazy((): any => import('src/modules/pastInquiry/PastInquiry')),
    },
    {
      path: '/filter',
      isPublic: true,
      component: lazy((): any => import('src/modules/demo/Demo')),
    },
    {
      path: '/setting',
      isPublic: true,
      component: lazy((): any => import('src/modules/demo/Demo')),
    },
    {
      path: '/about',
      isPublic: true,
      component: lazy((): any => import('src/modules/about/About')),
    },
    {
      path: '/demo',
      isPublic: true,
      component: lazy((): any => import('src/modules/demo/Demo')),
    },
  ],
  privateRoutes: [
    {
      path: '/',
      isPublic: false,
      isExact: true,
      subRoutes: [
        {
          path: 'path_name_who_show_in_URL',
          isPublic: false,
          isExact: false,
          // component: lazy((): any => import('component path')),
        },
        {
          path: '*',
          isPublic: false,
          component: lazy((): any => import('src/shared/components/NotFoundComponent')),
        },
      ],
    },
  ],
};
export default RoutesConfig;
