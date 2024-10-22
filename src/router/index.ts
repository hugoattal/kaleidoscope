import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { accessToken } from "@/lib/spotify/local.ts";

const routes: Array<RouteRecordRaw> = [
    {
        name: "landing",
        component: () => import("@/pages/landing/KLandingLayout.vue"),
        meta: {
            title: "Kaleidoscope"
        },
        path: "/"
    },
    {
        name: "builder",
        component: () => import("@/pages/builder/KBuilderLayout.vue"),
        meta: {
            title: "Builder - Kaleidoscope",
            requiresAuth: true
        },
        path: "/builder"
    },
    {
        name: "player",
        component: () => import("@/pages/player/KPlayerLayout.vue"),
        meta: {
            title: "Player - Kaleidoscope",
            requiresAuth: true
        },
        path: "/player"
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    document.title = to.meta.title as string || "Kaleidoscope";

    if (to.meta.requiresAuth) {
        if (!accessToken.value) {
            next({ name: "landing" });
            return;
        }
    }

    next();
});

export default router;
