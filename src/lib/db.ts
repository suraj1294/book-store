import { drizzle } from "drizzle-orm/libsql";
import config from "./config";
import * as schema from "./schema";
const db = drizzle({
  connection: {
    url: config.env.databaseUrl,
    authToken: config.env.databaseToken,
  },
  schema,
});

export default db;
