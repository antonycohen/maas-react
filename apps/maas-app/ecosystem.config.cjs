module.exports = {
    apps: [
        {
            name: 'maas-app',
            script: 'build/server/index.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
        },
    ],
};
