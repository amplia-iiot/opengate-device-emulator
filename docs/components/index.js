export { default as Compemulador } from '../..\\components\\compemulador.vue'
export { default as Eventos } from '../..\\components\\eventos.vue'
export { default as Lister } from '../..\\components\\lister.vue'
export { default as Maps } from '../..\\components\\maps.vue'
export { default as Operations } from '../..\\components\\operations.vue'
export { default as Sensors } from '../..\\components\\sensors.vue'
export { default as System } from '../..\\components\\system.vue'

export const LazyCompemulador = import('../..\\components\\compemulador.vue' /* webpackChunkName: "components_compemulador" */).then(c => c.default || c)
export const LazyEventos = import('../..\\components\\eventos.vue' /* webpackChunkName: "components_eventos" */).then(c => c.default || c)
export const LazyLister = import('../..\\components\\lister.vue' /* webpackChunkName: "components_lister" */).then(c => c.default || c)
export const LazyMaps = import('../..\\components\\maps.vue' /* webpackChunkName: "components_maps" */).then(c => c.default || c)
export const LazyOperations = import('../..\\components\\operations.vue' /* webpackChunkName: "components_operations" */).then(c => c.default || c)
export const LazySensors = import('../..\\components\\sensors.vue' /* webpackChunkName: "components_sensors" */).then(c => c.default || c)
export const LazySystem = import('../..\\components\\system.vue' /* webpackChunkName: "components_system" */).then(c => c.default || c)
