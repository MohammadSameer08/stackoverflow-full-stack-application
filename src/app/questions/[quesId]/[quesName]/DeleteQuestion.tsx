"use client";

import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";

const DeleteQuestion = ({ questionId, authorId }: { questionId: string; authorId: string }) => {
    const router = useRouter();
    const { user, hydrated } = useAuthStore();

    const deleteQuestion = async () => {
        try {
            await databases.deleteDocument(db, questionCollection, questionId);
            router.push("/questions");
        } catch (error: any) {
            window.alert(error?.message || "Something went wrong");
        }
    };

    // Only show button if hydrated and user is the author
    if (!hydrated || user?.$id !== authorId) {
        return null;
    }

    return (
        <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500 p-1 text-red-500 duration-200 hover:bg-red-500/10"
            onClick={deleteQuestion}
        >
            <IconTrash className="h-4 w-4" />
        </button>
    );
};

export default DeleteQuestion;
