document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const bookForm = document.getElementById('book-form');
    const booksList = document.getElementById('books-list');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const bookSection = document.getElementById('book-section');
    const addBookBtn = document.getElementById('add-book-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    const editBookForm = document.getElementById('edit-book-form');
    const editBookIdInput = document.getElementById('edit-book-id');
    const editBookTitleInput = document.getElementById('edit-book-title');
    const editBookAuthorInput = document.getElementById('edit-book-author');
    const editBookYearInput = document.getElementById('edit-book-year');
    const editBookCoverInput = document.getElementById('edit-book-cover');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

    let token = '';
    let userRole = '';

    showRegisterBtn.addEventListener('click', () => {
        loginSection.classList.add('hidden');
        registerSection.classList.remove('hidden');
    });

    showLoginBtn.addEventListener('click', () => {
        registerSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const role = document.getElementById('register-role').value;

        try {
            const response = await fetch('https://cute-gold-swordfish-cuff.cyclic.app/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, role })
            });

            if (response.headers.get('Content-Type').includes('application/json')) {
                const data = await response.json();

                if (response.ok) {
                    alert('Registration successful. Please log in.');
                    registerSection.classList.add('hidden');
                    loginSection.classList.remove('hidden');
                } else {
                    alert('Registration failed: ' + data.error);
                }
            } else {
                const text = await response.text();
                alert('Unexpected response: ' + text);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during registration.');
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('https://cute-gold-swordfish-cuff.cyclic.app/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.token) {
                token = data.token;
                userRole = data.role;  
                loginSection.classList.add('hidden');
                bookSection.classList.remove('hidden');
                fetchBooks();
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during login.');
        }
    });

    addBookBtn.addEventListener('click', () => {
        bookForm.classList.toggle('hidden');
    });

    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('book-title').value;
        const author = document.getElementById('book-author').value;
        const year = document.getElementById('book-year').value;
        const coverPage = document.getElementById('book-cover').files[0];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('year', year);
        formData.append('coverPage', coverPage);

        try {
            const response = await fetch('https://cute-gold-swordfish-cuff.cyclic.app/api/books', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                fetchBooks();
                bookForm.reset();
                bookForm.classList.add('hidden');
            } else {
                const data = await response.json();
                alert('Error adding book: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the book.');
        }
    });

    logoutBtn.addEventListener('click', () => {
        token = '';
        userRole = '';
        bookSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    async function fetchBooks() {
        if (userRole !== 'Admin') {
            addBookBtn.classList.add('hidden');
        }
        try {
            const response = await fetch('https://cute-gold-swordfish-cuff.cyclic.app/api/books', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const books = await response.json();
            booksList.innerHTML = books.map(book => `
                <div class="book-item">
                    <span>${book.title} by ${book.author} (${book.year})</span>
                    <button onclick="editBook('${book._id}')">Edit</button>
                    <button onclick="deleteBook('${book._id}')">Delete</button>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching books.');
        }
    }

    window.deleteBook = async function(bookId) {
        if (userRole !== 'Admin') {
            alert('Only admins can delete books.');
            return;
        }

        try {
            const response = await fetch(`https://cute-gold-swordfish-cuff.cyclic.app/api/books/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchBooks();
            } else {
                const data = await response.json();
                alert('Error deleting book: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting the book.');
        }
    }

    window.editBook = async function(bookId) {
        try {
            const response = await fetch(`https://cute-gold-swordfish-cuff.cyclic.app/api/books/${bookId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const book = await response.json();

            editBookIdInput.value = book._id;
            editBookTitleInput.value = book.title;
            editBookAuthorInput.value = book.author;
            editBookYearInput.value = book.year;
            editBookCoverInput.value = ''; 

            editBookForm.classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching the book details.');
        }
    }

    editBookForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const bookId = editBookIdInput.value;
        const title = editBookTitleInput.value;
        const author = editBookAuthorInput.value;
        const year = editBookYearInput.value;
        const coverPage = editBookCoverInput.files[0];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('year', year);
        if (coverPage) {
            formData.append('coverPage', coverPage);
        }

        try {
            const response = await fetch(`https://cute-gold-swordfish-cuff.cyclic.app/api/books/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                fetchBooks();
                editBookForm.reset();
                editBookForm.classList.add('hidden');
            } else {
                const data = await response.json();
                alert('Error updating book: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating the book.');
        }
    });

    cancelEditBtn.addEventListener('click', () => {
        editBookForm.classList.add('hidden');
    });
});
