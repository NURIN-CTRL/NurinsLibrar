
/* =================================
   NURIN'SLIBRAR - JAVASCRIPT
================================= */


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

                data: [
                    320,
                    280,
                    200,
                    250,
                    90,
                    110,
                    100,
                    80,
                    200
                ],

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
   BOOKS SEARCH FUNCTION
================================= */

const bookSearch = document.getElementById("bookSearch");
const bookSearchMessage = document.getElementById("bookSearchMessage");

if (bookSearch) {
    bookSearch.addEventListener("input", function () {
        const searchValue = bookSearch.value.toLowerCase().trim();

        const bookRows = document.querySelectorAll(
            ".dashboard-content table tbody tr"
        );

        let visibleCount = 0;

        bookRows.forEach(function (row) {
            const bookDetails = row.textContent.toLowerCase();

            if (bookDetails.includes(searchValue)) {
                row.style.display = "";
                visibleCount++;
            } else {
                row.style.display = "none";
            }
        });

        if (bookSearchMessage) {
            if (searchValue === "") {
                bookSearchMessage.textContent = "";
            } else if (visibleCount === 0) {
                bookSearchMessage.textContent = "No books found.";
            } else {
                bookSearchMessage.textContent =
                    visibleCount + " book(s) found.";
            }
        }
    });
}


/* =================================
   MEMBERS SEARCH FUNCTION
================================= */

const memberSearch = document.getElementById("memberSearch");
const memberSearchMessage = document.getElementById("memberSearchMessage");

if (memberSearch) {
    memberSearch.addEventListener("input", function () {
        const searchValue = memberSearch.value.toLowerCase().trim();

        const memberRows = document.querySelectorAll(
            ".dashboard-content table tbody tr"
        );

        let visibleCount = 0;

        memberRows.forEach(function (row) {
            const memberDetails = row.textContent.toLowerCase();

            if (memberDetails.includes(searchValue)) {
                row.style.display = "";
                visibleCount++;
            } else {
                row.style.display = "none";
            }
        });

        if (memberSearchMessage) {
            if (searchValue === "") {
                memberSearchMessage.textContent = "";
            } else if (visibleCount === 0) {
                memberSearchMessage.textContent = "No members found.";
            } else {
                memberSearchMessage.textContent =
                    visibleCount + " member(s) found.";
            }
        }
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
