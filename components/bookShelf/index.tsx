import React, { useEffect, useState } from "react";
import { Book } from "..";

import styles from "./bookShelf.module.scss";

interface Props {}

const BookShelf: React.FC<Props> = (props) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBooks = async () => {
    const res = await fetch("http://127.0.0.1:5000/subject/HIS");
    const bookJson = await res.json();
    setBooks(bookJson.books);
    setLoading(false);
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <p className={styles.title}>BEST SELLERS</p>
        <p>
          <a href="#">SEE ALL &gt;</a>
        </p>
      </div>
      <div className={styles.list}>
        <Book bookData={books[0]} loading={loading} />
        <Book bookData={books[1]} loading={loading} />
        <Book bookData={books[2]} loading={loading} />
        <Book bookData={books[3]} loading={loading} />
        <Book bookData={books[4]} loading={loading} />
      </div>
    </div>
  );
};

export default BookShelf;
