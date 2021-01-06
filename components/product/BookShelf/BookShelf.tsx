import React, { useEffect, useState } from "react";
import { BookPreview } from "components/product";

import styles from "./BookShelf.module.scss";

interface Props {
  subject: string;
}

const BookShelf: React.FC<Props> = (props) => {
  const { subject } = props;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBooks = async () => {
    const res = await fetch(`/api/subject/${subject}`);

    const bookJson = await res.json();

    setBooks(bookJson.data);
    setLoading(false);
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <p className={styles.title}>{subject}</p>
        <p>
          <a href="#">SEE ALL &gt;</a>
        </p>
      </div>
      <div className={styles.list}>
        <BookPreview bookData={books[0]} loading={loading} />
        <BookPreview bookData={books[1]} loading={loading} />
        <BookPreview bookData={books[2]} loading={loading} />
        <BookPreview bookData={books[3]} loading={loading} />
        <BookPreview bookData={books[4]} loading={loading} />
      </div>
    </div>
  );
};

export default BookShelf;
