module.exports = {
    apps: [
        {
            name: 'maas-app',
            cwd: './apps/maas-app',
            script: '../../node_modules/@react-router/serve/bin.js',
            args: './build/server/index.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: '4200',
                HOST: '0.0.0.0',
            },
        },
    ],
};
