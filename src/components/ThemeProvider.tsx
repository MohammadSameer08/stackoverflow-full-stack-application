"use client";

import React, { useEffect } from "react";
import { useThemeStore } from "@/store/Theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { isDark } = useThemeStore();
    const [mounted, setMounted] = React.useState(false);

    useEffect(() => {
        setMounted(true);
        const htmlElement = document.documentElement;
        if (isDark) {
            htmlElement.classList.add("dark");
        } else {
            htmlElement.classList.remove("dark");
        }
    }, [isDark]);

    // Prevent hydration mismatch by not rendering children until mounted
    if (!mounted) {
        return <>{children}</>;
    }

    return <>{children}</>;
}
