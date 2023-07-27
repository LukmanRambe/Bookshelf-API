import { nanoid } from 'nanoid';
import BOOKS from './books.js';

const addBookHandler = (req, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);

    return response;
  }

  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);

    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  BOOKS.push(newBook);

  const status = BOOKS.filter((book) => book.id === id).length > 0;

  if (status) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);

  return response;
};

const getAllBooksHandler = (req, h) => {
  const { name, reading, finished } = req.query;

  let filteredBooks = BOOKS;

  if (name !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading));
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished));
  }

  const response = h.response({
    status: 'success',
    data: {
      books:
        filteredBooks !== []
          ? filteredBooks.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            }))
          : [],
    },
  });

  response.code(200);

  return response;
};

const getBookByIdHandler = (req, h) => {
  const { id } = req.params;
  const book = BOOKS.filter((data) => data.id === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });

    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);

  return response;
};

const editBookByIdHandler = (req, h) => {
  const { id } = req.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;
  const updatedAt = new Date().toISOString();
  const index = BOOKS.findIndex((book) => book.id === id);

  if (index !== -1) {
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });

      response.code(400);

      return response;
    }

    if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });

      response.code(400);

      return response;
    }

    const finished = pageCount === readPage;

    BOOKS[index] = {
      ...BOOKS[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);

  return response;
};

const deleteBookHandler = (req, h) => {
  const { id } = req.params;
  const index = BOOKS.findIndex((book) => book.id === id);

  if (index !== -1) {
    BOOKS.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);

  return response;
};

export { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookHandler };
