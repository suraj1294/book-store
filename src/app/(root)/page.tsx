import BookList from "@/components/book-list";
import BookOverview from "@/components/book-overview";
import { sampleBooks } from "@/constants";

const testBook = sampleBooks[0];

export default async function Home() {
  return (
    <div>
      <BookOverview
        userId={testBook.author}
        id={testBook.id.toString()}
        title={testBook.title}
        author={testBook.author}
        genre={testBook.genre}
        rating={testBook.rating}
        totalCopies={testBook.totalCopies}
        availableCopies={testBook.availableCopies}
        description={testBook.description}
        coverColor={testBook.coverColor}
        coverUrl={testBook.coverUrl}
        videoUrl={testBook.videoUrl}
        summary={testBook.summary}
        createdAt={null}
      />
      <BookList title={""} books={sampleBooks} />
    </div>
  );
}
