import { createRouter, createWebHistory } from 'vue-router'
import { RouteName } from '@/router/route-names'
import { allDatabaseTypes, getTypeFromSlug } from '@/services/data-utils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteName.DASHBOARD,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/data/:databaseTypeSlug',
      name: RouteName.DATA,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/DataView.vue'),
      beforeEnter(to, from, next) {
        if (isDatabaseTypeValid(to?.params?.databaseTypeSlug as string)) {
          next()
        } else {
          next('/404')
        }
      },
    },
    {
      path: '/inspect/:databaseTypeSlug/:id',
      name: RouteName.ACTION_INSPECT,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/ActionInspectView.vue'),
      beforeEnter(to, from, next) {
        if (
          isDatabaseTypeValid(to?.params?.databaseTypeSlug as string) &&
          isIdValid(to?.params?.id as string)
        ) {
          next()
        } else {
          next('/404')
        }
      },
    },
    {
      // parentId is optional for creating child records with a specific parent id
      path: '/create/:databaseTypeSlug/:parentId?',
      name: RouteName.ACTION_CREATE,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/ActionCreateView.vue'),
      beforeEnter(to, from, next) {
        if (isDatabaseTypeValid(to?.params?.databaseTypeSlug as string)) {
          next()
        } else {
          next('/404')
        }
      },
    },
    {
      path: '/edit/:databaseTypeSlug/:id',
      name: RouteName.ACTION_EDIT,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/ActionEditView.vue'),
      beforeEnter(to, from, next) {
        if (
          isDatabaseTypeValid(to?.params?.databaseTypeSlug as string) &&
          isIdValid(to?.params?.id as string)
        ) {
          next()
        } else {
          next('/404')
        }
      },
    },
    {
      path: '/charts/:databaseTypeSlug/:id',
      name: RouteName.ACTION_CHARTS,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/ActionChartsView.vue'),
      beforeEnter(to, from, next) {
        if (
          isDatabaseTypeValid(to?.params?.databaseTypeSlug as string) &&
          isIdValid(to?.params?.id as string)
        ) {
          next()
        } else {
          next('/404')
        }
      },
    },
    {
      path: '/settings',
      name: RouteName.SETTINGS,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/faq',
      name: RouteName.FAQ,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/FAQView.vue'),
    },
    {
      path: '/about',
      name: RouteName.ABOUT,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/donate',
      name: RouteName.DONATE,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/DonateView.vue'),
    },
    {
      path: '/:pathMatch(.*)*', // 404 Not Found
      name: RouteName.NOT_FOUND,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

function isDatabaseTypeValid(databaseTypeSlug: string) {
  const typeSlug = getTypeFromSlug(databaseTypeSlug)

  if (typeSlug) {
    return allDatabaseTypes.includes(typeSlug)
  } else {
    return false
  }
}

function isIdValid(id: string) {
  return !!(id?.length > 0)
}

export default router
