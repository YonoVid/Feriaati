import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "https://webpay3gint.transbank.cl/",
                changeOrigin: true,
                secure: false,
                ws: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
            "/firebase": {
                target: "10.42.32.229",
                changeOrigin: true,
                secure: false,
                ws: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
        cors: {
            origin: [
                "localhost:5173",
                "localhost:5001",
                "localhost:4000",
                "https://webpay3gint.transbank.cl/",
                /\.webpay3gint.transbank\.cl$/,
            ],
            methods: ["GET", "POST"],
        },
    },
});
