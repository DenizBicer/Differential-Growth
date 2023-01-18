import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    resolve: {
        alias: {
            'tinyqueue': resolve(__dirname, '/node_modules/tinyqueue/tinyqueue.js')
        },
    },
})