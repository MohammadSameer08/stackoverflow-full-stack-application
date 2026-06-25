import { Permission, DatabasesIndexType, OrderBy } from "node-appwrite";
import { db, questionsCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
  await databases.createCollection(
    db,
    questionsCollection,
    questionsCollection,
    [
      Permission.read("any"),
      Permission.read("users"),
      Permission.create("any"),
      Permission.update("any"),
      Permission.delete("any"),
    ],
  );
  console.log(`Collection ${questionsCollection} created successfully.`);

  await Promise.all([
    databases.createStringAttribute(
      db,
      questionsCollection,
      "title",
      255,
      true,
    ),
    databases.createStringAttribute(
      db,
      questionsCollection,
      "content",
      1000,
      true,
    ),
    databases.createStringAttribute(
      db,
      questionsCollection,
      "authorId",
      255,
      true,
    ),
    databases.createStringAttribute(db, questionsCollection, "tags", 255, true),
    databases.createStringAttribute(
      db,
      questionsCollection,
      "attachmentId",
      255,
      true,
    ),
  ]);
  console.log(
    `Attributes for collection ${questionsCollection} created successfully.`,
  );

  //   await Promise.all([
  //     databases.createIndex(
  //       db,
  //       questionsCollection,
  //       "title_index",
  //       DatabasesIndexType.Fulltext,
  //       ["title"],
  //       [OrderBy.Asc],
  //     ),
  //     databases.createIndex(
  //       db,
  //       questionsCollection,
  //       "authorId_index",
  //       DatabasesIndexType.Fulltext,
  //       ["authorId"],
  //       [OrderBy.Asc],
  //     ),
  //   ]);
  //   console.log(
  //     `Index for collection ${questionsCollection} created successfully.`,
  //   );
}
