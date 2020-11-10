import {} from 'opengate-js/dist/opengate-api-bower-10.2.0'

export const state = () => ({
    api: null,
    user: null
})

export const mutations = {
    setOgapi(state, {
        config
    }) {
        // north/south uri -> http://opengate.es/north/v90 http://opengate.es/south/v90
        // MQTT uri -> http://mqtt.opengate.es
        state.user = config.user
        state.api = new window.OpenGateAPI({
            apiKey: config.user ? config.user.apiKey : null,
            url: (config.serverUrl || 'https://api.opengate.es') + '/north/v80',
            timeout: 120000,
            south: {
                url: (config.serverUrl || 'https://api.opengate.es') + '/south/v80'
            }
        })
    },
    setOgapiKey(state, {
        config
    }) {
        // north/south uri -> http://opengate.es/north/v90 http://opengate.es/south/v90
        // MQTT uri -> http://mqtt.opengate.es
        state.api = new window.OpenGateAPI({
            apiKey: config.key,
            url: (config.serverUrl || 'https://api.opengate.es') + '/north/v80',
            timeout: 120000,
            south: {
                url: (config.serverUrl || 'https://api.opengate.es') + '/south/v80'
            }
        })
    },

    removeApiKey(state) {
        state.user = null
        state.api = new window.OpenGateAPI({
            apiKey: null,
            url: (config.serverUrl || 'https://api.opengate.es') + '/north/v80',
            timeout: 120000,
            south: {
                url: (config.serverUrl || 'https://api.opengate.es') + '/south/v80'
            }
        })
    }
}