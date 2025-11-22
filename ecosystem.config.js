module.exports = {
    apps: [{
        name: 'dohproxy',
        script: './dist/main.js',
        instances: 'max', // Use all CPU cores
        exec_mode: 'cluster',
        autorestart: true,
        watch: false,
        max_memory_restart: '500M',
        env: {
            NODE_ENV: 'production',
            PORT: 3000
        },
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        merge_logs: true,
    }]
};
