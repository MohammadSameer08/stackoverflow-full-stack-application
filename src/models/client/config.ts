import { Client, Account, Avatars, Databases, Storage } from "appwrite";
import env from "../../env";
const client = new Client()
  .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
  .setProject(env.appwrite.projectId); // Your project ID

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const avatars = new Avatars(client);

export { client, account, databases, storage, avatars };
// const result = await account.create({
//   userId: "<USER_ID>",
//   email: "email@example.com",
//   password: "",
//   name: "<NAME>", // optional
// });

// console.log(result);
