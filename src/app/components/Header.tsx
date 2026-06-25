"use client";
import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconWorldQuestion, IconMoon, IconSun } from "@tabler/icons-react";
import { useAuthStore } from "@/store/Auth";
import { useThemeStore } from "@/store/Theme";
import slugify from "@/utils/slugify";

export default function Header() {
    const { user } = useAuthStore();
    const { isDark, toggleTheme } = useThemeStore();

    const navItems = [
        {
            name: "Home",
            link: "/",
            icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
        {
            name: "Questions",
            link: "/questions",
            icon: <IconWorldQuestion className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
    ];

    if (user)
        navItems.push({
            name: "Profile",
            link: `/users/${user.$id}/${slugify(user.name)}`,
            icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
        });

    return (
        <div className="relative w-full">
            <FloatingNav navItems={navItems} />
            <button
                onClick={toggleTheme}
                className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-slate-900 border border-white/20 hover:bg-white/80 dark:hover:bg-slate-800 transition-colors shadow-lg"
                aria-label="Toggle theme"
            >
                {isDark ? (
                    <IconSun className="h-5 w-5 text-yellow-500" />
                ) : (
                    <IconMoon className="h-5 w-5 text-slate-700" />
                )}
            </button>
        </div>
    );
}
