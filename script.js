/* =================================
   NURIN'SLIBRAR - JAVASCRIPT
================================= */


/* =================================
   DARK MODE FUNCTION
================================= */

const themeButtons = document.querySelectorAll(".theme-toggle");

function applyTheme(theme) {
    document.body.classList.toggle("dark-mode", theme === "dark");

    themeButtons.forEach(function (button) {
        button.textContent = theme === "dark" ? "☀️" : "🌙";
        button.setAttribute(
            "aria-label",
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        );
        button.setAttribute(
            "title",
            theme === "dark" ? "Light Mode" : "Dark Mode"
        );
    });
}

const savedTheme = localStorage.getItem("nurinLibraryTheme") || "light";
applyTheme(savedTheme);

themeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const newTheme = document.body.classList.contains("dark-mode")
            ? "light"
            : "dark";

        localStorage.setItem("nurinLibraryTheme", newTheme);
        applyTheme(newTheme);
    });
});


/* =================================
   LOGIN FUNCTION
================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const errorMessage = document.getElementById("errorMessage");

        const registeredUsers = JSON.parse(
            localStorage.getItem("nurinLibraryUsers") || "[]"
        );

        const registeredAccount = registeredUsers.find(function (user) {
            return user.email.toLowerCase() === username.toLowerCase()
                && user.password === password;
        });

        if (
            (username === "yenyen" && password === "100805")
            || registeredAccount
        ) {
            window.location.href = "dashboard.html";
        } else {
            errorMessage.textContent =
                "Invalid username or password. Please try again.";
        }
    });
}


/* =================================
   REGISTER FUNCTION
================================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const registerMessage = document.getElementById("registerMessage");

        if (password !== confirmPassword) {
            registerMessage.style.color = "#c0395b";
            registerMessage.textContent = "Passwords do not match.";
            return;
        }

        const registeredUsers = JSON.parse(
            localStorage.getItem("nurinLibraryUsers") || "[]"
        );

        const emailExists = registeredUsers.some(function (user) {
            return user.email.toLowerCase() === email.toLowerCase();
        });

        if (emailExists) {
            registerMessage.style.color = "#c0395b";
            registerMessage.textContent = "This email is already registered.";
            return;
        }

        registeredUsers.push({
            fullName: fullName,
            email: email,
            password: password
        });

        localStorage.setItem(
            "nurinLibraryUsers",
            JSON.stringify(registeredUsers)
        );

        registerMessage.style.color = "#6b8e75";
        registerMessage.textContent =
            "Account created successfully! You can now login.";

        registerForm.reset();
    });
}


/* =================================
   DASHBOARD CHART - SOFT PINK THEME
================================= */

const chartCanvas = document.getElementById("booksChart");

if (chartCanvas && typeof Chart !== "undefined") {
    new Chart(chartCanvas, {
        type: "bar",

        data: {
            labels: [
                "Education",
                "Technology",
                "Reference",
                "Fiction",
                "Horror",
                "Romance",
                "Fantasy",
                "Science Fiction",
                "History"
            ],

            datasets: [{
                label: "Number of Books",

                data: [320, 280, 200, 250, 90, 110, 100, 80, 200],

                backgroundColor: [
                    "#F2DFE5",
                    "#EACAD5",
                    "#D9B8C5",
                    "#E6E0F0",
                    "#E8E3ED",
                    "#F8E1E8",
                    "#D2C8E0",
                    "#E1EBF0",
                    "#E8EDE8"
                ],

                borderWidth: 1,
                borderRadius: 8,
                maxBarThickness: 48
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                y: {
                    beginAtZero: true,

                    title: {
                        display: true,
                        text: "Number of Books",
                        color: "#746779"
                    },

                    ticks: {
                        color: "#968C98"
                    },

                    grid: {
                        color: "#F0E8ED"
                    }
                },

                x: {
                    grid: {
                        display: false
                    },

                    ticks: {
                        color: "#746779",
                        maxRotation: 45,
                        minRotation: 0
                    }
                }
            }
        }
    });
}


/* =================================
   HELPER FUNCTIONS
================================= */

function getSavedData(key) {
    try {
        const savedData = localStorage.getItem(key);
        return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
        return null;
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getBootstrapModal(modalId) {
    const modalElement = document.getElementById(modalId);

    if (!modalElement || typeof bootstrap === "undefined") {
        return null;
    }

    return bootstrap.Modal.getOrCreateInstance(modalElement);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return characters[character];
    });
}

function createStatusLabel(status) {
    const statusClass = status === "Available" || status === "Active"
        ? "status-available"
        : "status-borrowed";

    return `<span class="${statusClass}">${escapeHTML(status)}</span>`;
}

function matchesFilter(value, filterValue) {
    return filterValue === "" ||
        String(value).toLowerCase() === String(filterValue).toLowerCase();
}


/* =================================
   BOOKS MANAGEMENT
================================= */

const bookTableBody = document.getElementById("bookTableBody");
const bookStorageKey = "nurinLibraryBooks";

let books = [];

if (bookTableBody) {

    const savedBooks = getSavedData(bookStorageKey);

    if (savedBooks !== null) {
        books = savedBooks;
    } else {
        books = Array.from(bookTableBody.querySelectorAll("tr")).map(
            function (row) {
                const cells = row.querySelectorAll("td");

                return {
                    id: cells[0].textContent.trim(),
                    title: cells[1].textContent.trim(),
                    author: cells[2].textContent.trim(),
                    category: cells[3].textContent.trim(),
                    status: cells[4].textContent.trim()
                };
            }
        );

        saveData(bookStorageKey, books);
    }

    renderBooks();
}
function renderBooks() {
    if (!bookTableBody) return;

    const searchValue = (
        document.getElementById("bookSearch")?.value || ""
    ).toLowerCase().trim();

    const categoryValue =
        document.getElementById("bookCategoryFilter")?.value || "";

    const statusValue =
        document.getElementById("bookStatusFilter")?.value || "";

    let visibleCount = 0;

    bookTableBody.innerHTML = "";

    books.forEach(function (book, index) {

        const bookDetails = (
            book.id + " " +
            book.title + " " +
            book.author + " " +
            book.category + " " +
            book.status
        ).toLowerCase();

        const matchesSearch = bookDetails.includes(searchValue);
        const matchesCategory = matchesFilter(book.category, categoryValue);
        const matchesStatus = matchesFilter(book.status, statusValue);

        if (matchesSearch && matchesCategory && matchesStatus) {

            visibleCount++;

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHTML(book.id)}</td>
                <td>${escapeHTML(book.title)}</td>
                <td>${escapeHTML(book.author)}</td>
                <td>${escapeHTML(book.category)}</td>
                <td>${createStatusLabel(book.status)}</td>
                <td>
                    <div class="action-buttons">
                        <button type="button"
                            class="edit-button"
                            data-edit-book="${index}">
                            Edit
                        </button>
                        <button type="button"
                            class="btn btn-sm btn-outline-danger"
                            data-delete-book="${index}">
                            Delete
                        </button>
                    </div>
                </td>
            `;

            bookTableBody.appendChild(row);
        }
    });

    const message = document.getElementById("bookSearchMessage");

    if (message) {
        message.textContent = visibleCount === 0
            ? "No books found."
            : visibleCount + " book(s) found.";
    }

    updateBookStatistics();
}

function updateBookStatistics() {
    const total = books.length;
    const available = books.filter(
        book => book.status === "Available"
    ).length;
    const borrowed = books.filter(
        book => book.status === "Borrowed"
    ).length;

    const totalElement = document.getElementById("totalBooksCount");
    const availableElement = document.getElementById("availableBooksCount");
    const borrowedElement = document.getElementById("borrowedBooksCount");

    if (totalElement) totalElement.textContent = total.toLocaleString();
    if (availableElement) availableElement.textContent = available.toLocaleString();
    if (borrowedElement) borrowedElement.textContent = borrowed.toLocaleString();
}


/* Book search and filters */

const bookSearch = document.getElementById("bookSearch");
const bookCategoryFilter = document.getElementById("bookCategoryFilter");
const bookStatusFilter = document.getElementById("bookStatusFilter");

if (bookSearch) {
    bookSearch.addEventListener("input", renderBooks);
}

if (bookCategoryFilter) {
    bookCategoryFilter.addEventListener("input", renderBooks);
    bookCategoryFilter.addEventListener("change", renderBooks);
}

if (bookStatusFilter) {
    bookStatusFilter.addEventListener("input", renderBooks);
    bookStatusFilter.addEventListener("change", renderBooks);
}


/* Open Add Book Modal */

const addBookButton = document.getElementById("addBookButton");

if (addBookButton) {
    addBookButton.addEventListener("click", function () {

        const form = document.getElementById("bookForm");

        if (form) form.reset();

        document.getElementById("bookModalTitle").textContent =
            "Add New Book";

        document.getElementById("bookEditIndex").value = "";

        const message = document.getElementById("bookFormMessage");
        if (message) message.textContent = "";

        const modal = getBootstrapModal("bookModal");
        if (modal) modal.show();
    });
}


/* Open Edit Book Modal */

if (bookTableBody) {
    bookTableBody.addEventListener("click", function (event) {

        const deleteButton = event.target.closest("[data-delete-book]");

        if (deleteButton) {
            const index = Number(deleteButton.dataset.deleteBook);
            const book = books[index];

            if (!book) return;

            const confirmDelete = confirm(
                `Are you sure you want to delete "${book.title}"?`
            );

            if (confirmDelete) {
                books.splice(index, 1);
                saveData(bookStorageKey, books);
                renderBooks();
            }

            return;
        }

        const editButton = event.target.closest("[data-edit-book]");

        if (!editButton) return;

        const index = Number(editButton.dataset.editBook);
        const book = books[index];

        if (!book) return;

        document.getElementById("bookModalTitle").textContent =
            "Edit Book";

        document.getElementById("bookEditIndex").value = index;
        document.getElementById("bookId").value = book.id;
        document.getElementById("bookTitle").value = book.title;
        document.getElementById("bookAuthor").value = book.author;
        document.getElementById("bookCategory").value = book.category;
        document.getElementById("bookStatus").value = book.status;

        const message = document.getElementById("bookFormMessage");
        if (message) message.textContent = "";

        const modal = getBootstrapModal("bookModal");
        if (modal) modal.show();
    });
}


/* Save Book */

const bookForm = document.getElementById("bookForm");

if (bookForm) {
    bookForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const editIndex = document.getElementById("bookEditIndex").value;

        const newBook = {
            id: document.getElementById("bookId").value.trim(),
            title: document.getElementById("bookTitle").value.trim(),
            author: document.getElementById("bookAuthor").value.trim(),
            category: document.getElementById("bookCategory").value,
            status: document.getElementById("bookStatus").value
        };

        const message = document.getElementById("bookFormMessage");

        const duplicateID = books.some(function (book, index) {
            return book.id.toLowerCase() === newBook.id.toLowerCase()
                && String(index) !== editIndex;
        });

        if (duplicateID) {
            message.textContent = "This Book ID already exists.";
            message.style.color = "#C0395B";
            return;
        }

        if (editIndex === "") {
            books.push(newBook);
        } else {
            books[Number(editIndex)] = newBook;
        }

        saveData(bookStorageKey, books);
        renderBooks();

        const modal = getBootstrapModal("bookModal");
        if (modal) modal.hide();
    });
}


/* =================================
   MEMBERS MANAGEMENT
================================= */

const memberTableBody = document.getElementById("memberTableBody");
const memberStorageKey = "nurinLibraryMembers";

let members = [];

if (memberTableBody) {

    const savedMembers = getSavedData(memberStorageKey);

    if (savedMembers !== null) {
        members = savedMembers;
    } else {
        members = Array.from(memberTableBody.querySelectorAll("tr")).map(
            function (row) {
                const cells = row.querySelectorAll("td");

                return {
                    id: cells[0].textContent.trim(),
                    name: cells[1].textContent.trim(),
                    email: cells[2].textContent.trim(),
                    type: cells[3].textContent.trim(),
                    status: cells[4].textContent.trim()
                };
            }
        );

        saveData(memberStorageKey, members);
    }

    renderMembers();
}
function renderMembers() {
    if (!memberTableBody) return;

    const searchValue = (
        document.getElementById("memberSearch")?.value || ""
    ).toLowerCase().trim();

    const typeValue =
        document.getElementById("memberTypeFilter")?.value || "";

    const statusValue =
        document.getElementById("memberStatusFilter")?.value || "";

    let visibleCount = 0;

    memberTableBody.innerHTML = "";

    members.forEach(function (member, index) {

        const memberDetails = (
            member.id + " " +
            member.name + " " +
            member.email + " " +
            member.type + " " +
            member.status
        ).toLowerCase();

        const matchesSearch = memberDetails.includes(searchValue);
        const matchesType = matchesFilter(member.type, typeValue);
        const matchesStatus = matchesFilter(member.status, statusValue);

        if (matchesSearch && matchesType && matchesStatus) {

            visibleCount++;

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHTML(member.id)}</td>
                <td>${escapeHTML(member.name)}</td>
                <td>${escapeHTML(member.email)}</td>
                <td>${escapeHTML(member.type)}</td>
                <td>${createStatusLabel(member.status)}</td>
                <td>
                    <div class="action-buttons">
                        <button type="button"
                            class="edit-button"
                            data-edit-member="${index}">
                            Edit
                        </button>
                        <button type="button"
                            class="btn btn-sm btn-outline-danger"
                            data-delete-member="${index}">
                            Delete
                        </button>
                    </div>
                </td>
            `;

            memberTableBody.appendChild(row);
        }
    });

    const message = document.getElementById("memberSearchMessage");

    if (message) {
        message.textContent = visibleCount === 0
            ? "No members found."
            : visibleCount + " member(s) found.";
    }

    updateMemberStatistics();
}

function updateMemberStatistics() {
    const total = members.length;
    const active = members.filter(
        member => member.status === "Active"
    ).length;
    const inactive = members.filter(
        member => member.status === "Inactive"
    ).length;

    const totalElement = document.getElementById("totalMembersCount");
    const activeElement = document.getElementById("activeMembersCount");
    const inactiveElement = document.getElementById("inactiveMembersCount");

    if (totalElement) totalElement.textContent = total.toLocaleString();
    if (activeElement) activeElement.textContent = active.toLocaleString();
    if (inactiveElement) inactiveElement.textContent = inactive.toLocaleString();
}


/* Member search and filters */

const memberSearch = document.getElementById("memberSearch");
const memberTypeFilter = document.getElementById("memberTypeFilter");
const memberStatusFilter = document.getElementById("memberStatusFilter");

if (memberSearch) {
    memberSearch.addEventListener("input", renderMembers);
}

if (memberTypeFilter) {
    memberTypeFilter.addEventListener("input", renderMembers);
    memberTypeFilter.addEventListener("change", renderMembers);
}

if (memberStatusFilter) {
    memberStatusFilter.addEventListener("input", renderMembers);
    memberStatusFilter.addEventListener("change", renderMembers);
}


/* Open Add Member Modal */

const addMemberButton = document.getElementById("addMemberButton");

if (addMemberButton) {
    addMemberButton.addEventListener("click", function () {

        const form = document.getElementById("memberForm");

        if (form) form.reset();

        document.getElementById("memberModalTitle").textContent =
            "Add New Member";

        document.getElementById("memberEditIndex").value = "";

        const message = document.getElementById("memberFormMessage");
        if (message) message.textContent = "";

        const modal = getBootstrapModal("memberModal");
        if (modal) modal.show();
    });
}


/* Open Edit Member Modal */

if (memberTableBody) {
    memberTableBody.addEventListener("click", function (event) {

        const deleteButton = event.target.closest("[data-delete-member]");

        if (deleteButton) {
            const index = Number(deleteButton.dataset.deleteMember);
            const member = members[index];

            if (!member) return;

            const confirmDelete = confirm(
                `Are you sure you want to delete "${member.name}"?`
            );

            if (confirmDelete) {
                members.splice(index, 1);
                saveData(memberStorageKey, members);
                renderMembers();
            }

            return;
        }

        const editButton = event.target.closest("[data-edit-member]");

        if (!editButton) return;

        const index = Number(editButton.dataset.editMember);
        const member = members[index];

        if (!member) return;

        document.getElementById("memberModalTitle").textContent =
            "Edit Member";

        document.getElementById("memberEditIndex").value = index;
        document.getElementById("memberId").value = member.id;
        document.getElementById("memberName").value = member.name;
        document.getElementById("memberEmail").value = member.email;
        document.getElementById("memberType").value = member.type;
        document.getElementById("memberStatus").value = member.status;

        const message = document.getElementById("memberFormMessage");
        if (message) message.textContent = "";

        const modal = getBootstrapModal("memberModal");
        if (modal) modal.show();
    });
}


/* Save Member */

const memberForm = document.getElementById("memberForm");

if (memberForm) {
    memberForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const editIndex = document.getElementById("memberEditIndex").value;

        const newMember = {
            id: document.getElementById("memberId").value.trim(),
            name: document.getElementById("memberName").value.trim(),
            email: document.getElementById("memberEmail").value.trim(),
            type: document.getElementById("memberType").value,
            status: document.getElementById("memberStatus").value
        };

        const message = document.getElementById("memberFormMessage");

        const duplicateID = members.some(function (member, index) {
            return member.id.toLowerCase() === newMember.id.toLowerCase()
                && String(index) !== editIndex;
        });

        if (duplicateID) {
            message.textContent = "This Member ID already exists.";
            message.style.color = "#C0395B";
            return;
        }

        const duplicateEmail = members.some(function (member, index) {
            return member.email.toLowerCase() === newMember.email.toLowerCase()
                && String(index) !== editIndex;
        });

        if (duplicateEmail) {
            message.textContent = "This email is already registered.";
            message.style.color = "#C0395B";
            return;
        }

        if (editIndex === "") {
            members.push(newMember);
        } else {
            members[Number(editIndex)] = newMember;
        }

        saveData(memberStorageKey, members);
        renderMembers();

        const modal = getBootstrapModal("memberModal");
        if (modal) modal.hide();
    });
}


/* =================================
   BORROWING SEARCH FUNCTION
================================= */

const borrowingSearch = document.getElementById("borrowingSearch");
const borrowingSearchMessage = document.getElementById("borrowingSearchMessage");

if (borrowingSearch) {
    borrowingSearch.addEventListener("input", function () {
        const searchValue = borrowingSearch.value.toLowerCase().trim();

        const borrowingRows = document.querySelectorAll(
            ".dashboard-content table tbody tr"
        );

        let visibleCount = 0;

        borrowingRows.forEach(function (row) {
            const borrowingDetails = row.textContent.toLowerCase();

            if (borrowingDetails.includes(searchValue)) {
                row.style.display = "";
                visibleCount++;
            } else {
                row.style.display = "none";
            }
        });

        if (borrowingSearchMessage) {
            if (searchValue === "") {
                borrowingSearchMessage.textContent = "";
            } else if (visibleCount === 0) {
                borrowingSearchMessage.textContent =
                    "No borrowing records found.";
            } else {
                borrowingSearchMessage.textContent =
                    visibleCount + " record(s) found.";
            }
        }
    });
}


/* =================================
   CATEGORIES SEARCH FUNCTION
================================= */

const categorySearch = document.getElementById("categorySearch");
const categorySearchMessage = document.getElementById("categorySearchMessage");

if (categorySearch) {
    categorySearch.addEventListener("input", function () {
        const searchValue = categorySearch.value.toLowerCase().trim();

        const categoryCards = document.querySelectorAll(".category-card");

        let visibleCount = 0;

        categoryCards.forEach(function (card) {
            const categoryDetails = card.textContent.toLowerCase();

            if (categoryDetails.includes(searchValue)) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        if (categorySearchMessage) {
            if (searchValue === "") {
                categorySearchMessage.textContent = "";
            } else if (visibleCount === 0) {
                categorySearchMessage.textContent = "No categories found.";
            } else {
                categorySearchMessage.textContent =
                    visibleCount + (visibleCount === 1
                        ? " category found."
                        : " categories found.");
            }
        }
    });
}