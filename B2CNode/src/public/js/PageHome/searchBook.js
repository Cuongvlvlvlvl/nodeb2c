const bookTemplate = document.querySelector("[data-books-template]")
const bookContainer = document.querySelector("[data-books-container]")
const searchInput = document.querySelector("[data-search]")
let books = []



searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase()
    // console.log(books)
    books.forEach(book => {
        const isVisible = book.book.toLowerCase().includes(value)
        book.element.classList.toggle("hide", !isVisible)
    })
})

fetch("http://localhost:8000/read")
    .then(res => res.json())
    .then(data => {
        books = data.map(book => {
            const card = bookTemplate.content.cloneNode(true).children[0]
            const bookData = card.querySelector("[data-book]")
            bookData.textContent = book.bookname
            bookData.href = "/read/" + book.slug
            bookContainer.append(card)
            return{book: book.bookname, element: card}
            // console.log(card)
        });
    })