/**
 * PM2 生产启动配置
 * 在服务器项目目录执行：pm2 start ecosystem.config.cjs
 */
module.exports = {
    apps: [
        {
            name: 'scada-iot',
            cwd: __dirname,
            script: 'npx',
            args: 'tsx server.ts',
            interpreter: 'none',
            env: {
                NODE_ENV: 'production',
                APP_ENV: 'local',
                APP_HOST: '0.0.0.0',
                // 8082 由 Nginx 占用；Node 监听 3000，Nginx 反代 /api → 127.0.0.1:3000
                APP_PORT: '3000',
                DB_ENABLE: 'false',
            },
        },
    ],
};
