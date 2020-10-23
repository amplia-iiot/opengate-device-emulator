import {} from 'opengate-js/dist/opengate-api-bower-10.2.0'

export const state = () => ({
    apiKey: null,
    api: null,
  })
  
export const mutations = {
    setOgapi(state, { config }) {
        // north/south uri -> http://opengate.es/north/v90 http://opengate.es/south/v90
        // MQTT uri -> http://mqtt.opengate.es
        state.apiKey = config.apiKey
        state.api = new window.OpenGateAPI({
            apiKey: config.apiKey,
            url: (config.serverUrl || 'https://api.opengate.es') + '/north/v80',
            timeout: 120000,
            south: {
                url: (config.serverUrl || 'https://api.opengate.es') + '/south/v80'
            }
        })
    }
}