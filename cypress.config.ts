import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:4200',
        port: 4250,
        viewportWidth: 1200,
        viewportHeight: 800,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
