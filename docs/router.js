import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _72e9494a = () => interopDefault(import('..\\pages\\emulador.vue' /* webpackChunkName: "pages/emulador" */))
const _e4cf25a0 = () => interopDefault(import('..\\pages\\listerpage.vue' /* webpackChunkName: "pages/listerpage" */))
const _ef850228 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/emulador",
    component: _72e9494a,
    name: "emulador"
  }, {
    path: "/listerpage",
    component: _e4cf25a0,
    name: "listerpage"
  }, {
    path: "/",
    component: _ef850228,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
