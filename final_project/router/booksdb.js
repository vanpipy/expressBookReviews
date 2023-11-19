let books = [
    {"author": "Chinua Achebe","title": "Things Fall Apart", "isbn": "1", "reviews": {} },
    {"author": "Hans Christian Andersen","title": "Fairy tales", "isbn": "2", "reviews": { "Unknown": { "message": "test review message" } } },
    {"author": "Dante Alighieri","title": "The Divine Comedy", "isbn": "3", "reviews": {} },
    {"author": "Unknown","title": "The Epic Of Gilgamesh", "isbn": "4", "reviews": {} },
    {"author": "Unknown","title": "The Book Of Job", "isbn": "5", "reviews": {} },
    {"author": "Unknown","title": "One Thousand and One Nights", "isbn": "6", "reviews": {} },
    {"author": "Unknown","title": "Nj\u00e1l's Saga", "isbn": "7", "reviews": {} },
    {"author": "Jane Austen","title": "Pride and Prejudice", "isbn": "8", "reviews": {} },
    {"author": "Honor\u00e9 de Balzac","title": "Le P\u00e8re Goriot", "isbn": "9", "reviews": {} },
    {"author": "Samuel Beckett","title": "Molloy, Malone Dies, The Unnamable, the trilogy", "isbn": "10", "reviews": {} }
]

const findBook = (matcher = _ => false) => {
    const expextedBooks = books.filter(matcher)
    if (expextedBooks && expextedBooks.length) {
        return expextedBooks
    }
    return null
}

const updateBook = (matcher = _ => false, value) => {
    const index = books.findIndex(matcher)
    if (index > -1) {
        const book = books[index]
        books[index] = { ...book, ...value }
        return books[index]
    }
}

const deleteBook = (matcher = _ => false) => {
    const index = books.findIndex(matcher)
    if (index > -1) {
        const book = books.splice(index, 1)
        return book
    }
}

const queryBooksAsync = (matcher) => new Promise((resolve) => {
    if (typeof(matcher) === 'function') {
        const result = books.filter(matcher)
        result(result)
    }

    resolve(books)
})

module.exports.findBook = findBook
module.exports.updateBook = updateBook
module.exports.deleteBook = deleteBook
module.exports.queryBooksAsync = queryBooksAsync
module.exports.books = books;
