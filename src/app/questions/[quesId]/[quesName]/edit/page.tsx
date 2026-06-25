import { db, questionsCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import { Models } from "appwrite";
import EditQues from "./EditQues";

interface QuestionDocument extends Models.Document {
    authorId: string;
    title: string;
}

const Page = async ({ params }: { params: Promise<{ quesId: string; quesName: string }> }) => {
    const { quesId } = await params;
    const question = await databases.getDocument(db, questionsCollection, quesId);

    return <EditQues question={JSON.parse(JSON.stringify(question)) as unknown as QuestionDocument} />;
};

export default Page;
