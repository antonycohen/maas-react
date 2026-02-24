module.exports = {
    apps: [
        {
            name: 'maas-app',
            cwd: './apps/maas-app',
            script: 'server.mjs', // Point to your new wrapper
            instances: '2',
            max_memory_restart: '512M',   // Now cluster mode will work perfectly
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production',
                PORT: '4200',
            },
        },
    ],
};