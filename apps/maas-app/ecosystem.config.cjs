module.exports = {
    apps: [
        {
            name: 'maas-app',
            script: 'node_modules/.bin/react-router-serve',
            args: './build/server/index.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production',
                PORT: 4200,
            },
        },
    ],
};
