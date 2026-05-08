export interface interfaceHealth {
    status: string,
    version: string,
    latency: string,
    timestamp: string,
    uptimeMs: number,
    uptime: number,
    services: {
        database: string,
        whatsapp: string
    },

}