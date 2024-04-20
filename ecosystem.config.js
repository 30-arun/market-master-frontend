module.exports = {
    apps: [
        {
            name: "next-app",
            script: "server.js",
            log_date_format: "YYYY-MM-DD HH:mm Z",
            out_file: "/var/log/next-app-out.log",
            error_file: "/var/log/next-app-error.log",
        },
    ],
};
