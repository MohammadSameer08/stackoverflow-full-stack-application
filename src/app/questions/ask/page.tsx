"use client";

import React from "react";
import QuestionForm from "@/components/QuestionForm";
import { useAuthStore } from "@/store/Auth";
import { redirect } from "next/navigation";

export default function AskQuestion() {
    const { session } = useAuthStore();

    // Redirect to login if not authenticated
    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-black dark:bg-black">
            <div className="container mx-auto px-4 pb-20 pt-36">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold mb-2 text-white">Ask a Question</h1>
                    <p className="text-gray-400">Share your question with the community</p>
                </div>
                <div className="max-w-3xl">
                    <QuestionForm />
                </div>
            </div>
        </div>
    );
}
