import { auth } from "@/auth";
import BookList from "@/components/book-list";
import BookOverview from "@/components/book-overview";

import db from "@/lib/db";
import { books } from "@/lib/schema";
import { desc } from "drizzle-orm";

export default async function Home() {
  const session = await auth();
  const latestBooks = (await db
    .select()
    .from(books)
    .limit(10)
    .orderBy(desc(books.createdAt))) as Book[];

  return (
    <div>
      <BookOverview
        {...latestBooks[0]}
        userId={+(session?.user?.id ?? 0) as number}
      />
      <BookList
        title={"Latest Books"}
        books={latestBooks.slice(1)}
        containerClassName="mt-28"
      />
    </div>
  );
}
