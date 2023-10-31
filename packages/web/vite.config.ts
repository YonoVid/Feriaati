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
                target: "https://us-central1-feria-a-ti.cloudfunctions.net/",
                changeOrigin: true,
                secure: false,
                ws: true,
                rewrite: (path) => path.replace(/^\/firebase/, ""),
            },
        },
        cors: {
            origin: [
                "http://10.42.33.33:5173",
                "http://10.42.33.33:5001",
                "http://10.42.33.33:4000",
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
