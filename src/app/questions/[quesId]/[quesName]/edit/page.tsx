import { db, questionsCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import { Models } from "appwrite";
import EditQues from "./EditQues";

interface QuestionDocument extends Models.Document {
    authorId: string;
    title: string;
}

const Page = async ({ params }: { params: { quesId: string; quesName: string } }) => {
    const question = await databases.getDocument(db, questionsCollection, params.quesId);

    return <EditQues question={question as unknown as QuestionDocument} />;
};

export default Page;
