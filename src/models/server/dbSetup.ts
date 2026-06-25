import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
import getOrCreateStorage from "./storage.collection";

import { databases } from "./config";

export default async function setupDatabase() {
  try {
    await databases.get(db);
    console.log("Database Connected");
  } catch (error) {
    try {
      await databases.create(db, db);
      console.log("Database Created");
      await createQuestionCollection();
      await createAnswerCollection();
      await createCommentCollection();
      await createVoteCollection();
      await getOrCreateStorage();
      console.log("Database Setup Completed");
      console.log("Database Connected");
    } catch (error) {
      console.error("Error creating database:", error);
    }
  }

  return databases;
}
