import vue from "@vitejs/plugin-vue";
import * as path from "path";
import { defineConfig } from "vite";

const alias = {
    "@": path.resolve(__dirname, "src")
};

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [vue()],
    resolve: {
        alias
    },
    server: {
        host: "127.0.0.1",
        port: 8080
    }
});
