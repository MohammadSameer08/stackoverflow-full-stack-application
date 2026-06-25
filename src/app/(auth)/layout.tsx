"use client";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { session } = useAuthStore();
    const router = useRouter();
    React.useEffect(() => {
        if (session) {
            router.push("/"); // Redirect to the home page if the user is logged in
        }
    }, [session, router]);

    if (session) {
        return null; // Render nothing while redirecting
    }
    return <>{children}</>;
}

export default Layout;