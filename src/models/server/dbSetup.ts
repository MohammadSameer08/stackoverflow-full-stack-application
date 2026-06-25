import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
import getOrCreateStorage from "./storageSetup";

import { databases } from "./config";

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log("Database Connected");
  } catch {
    try {
      await databases.create(db, db);
      console.log("Database Created");

      // Create each collection with individual error handling
      await createCollectionSafely("Questions", createQuestionCollection);
      await createCollectionSafely("Answers", createAnswerCollection);
      await createCollectionSafely("Comments", createCommentCollection);
      await createCollectionSafely("Votes", createVoteCollection);
      await createCollectionSafely("Storage", getOrCreateStorage);

      console.log("Database Setup Completed");
      console.log("Database Connected");
    } catch (_error) {
      console.error("Error creating database:", _error);
    }
  }

  return databases;
}

async function createCollectionSafely(
  name: string,
  createFn: () => Promise<void>,
) {
  try {
    await createFn();
    console.log(`${name} collection created successfully`);
  } catch (error) {
    console.error(`Error creating ${name} collection:`, error);
  }
}
