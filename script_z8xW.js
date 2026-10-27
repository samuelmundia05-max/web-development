"use strict";

// ========================================
// 1. SELECT HTML ELEMENTS
// ========================================

const form = document.getElementById("regform");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const genderInput = document.getElementById("gender");
const dobInput = document.getElementById("dob");
const countryInput = document.getElementById("country");
const phoneInput = document.getElementById("phone");
const bioInput = document.getElementById("bio");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmError = document.getElementById("confirmError");
const genderError = document.getElementById("genderError");
const dobError = document.getElementById("dobError");
const countryError = document.getElementById("countryError");
const phoneError = document.getElementById("phoneError");
const bioError = document.getElementById("bioError");

const successMsg = document.getElementById("successMsg");
const memberList = document.getElementById("memberList");
const count = document.getElementById("count");
const themeButton = document.getElementById("theme");

// Log selected elements to the console
console.log("Registration form:", form);
console.log("Name input:", nameInput);
console.log("Email input:", emailInput);
console.log("Password input:", passwordInput);
console.log("Confirm password input:", confirmPasswordInput);
console.log("Gender input:", genderInput);
console.log("Date of birth input:", dobInput);
console.log("Country input:", countryInput);
console.log("Phone input:", phoneInput);
console.log("Bio input:", bioInput);
console.log("Error messages:", document.querySelectorAll(".error"));
console.log("Success message:", successMsg);
console.log("Member list:", memberList);
console.log("Member counter:", count);
console.log("Dark mode button:", themeButton);


// ========================================
// 2. CHECK THAT REQUIRED ELEMENTS EXIST
// ========================================

if (
    !form || !nameInput || !emailInput ||
    !passwordInput || !confirmPasswordInput ||
    !genderInput || !dobInput || !countryInput ||
    !phoneInput || !bioInput || !memberList ||
    !count || !successMsg || !themeButton
) {
    console.error(
        "Some required HTML elements are missing. Check your HTML IDs."
    );
}


// ========================================
// 3. STORE FIELD AND ERROR PAIRS
// ========================================

const fields = [
    { input: nameInput, error: nameError },
    { input: emailInput, error: emailError },
    { input: passwordInput, error: passwordError },
    { input: confirmPasswordInput, error: confirmError },
    { input: genderInput, error: genderError },
    { input: dobInput, error: dobError },
    { input: countryInput, error: countryError },
    { input: phoneInput, error: phoneError },
    { input: bioInput, error: bioError }
];

let editingMember = null;


// ========================================
// 4. SHOW AND CLEAR ERRORS
// ========================================

function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
}

function clearError(input, errorElement) {
    errorElement.textContent = "";
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
}

function clearAllErrors() {
    fields.forEach(({ input, error }) => {
        clearError(input, error);
    });
}


// ========================================
// 5. VALIDATE EACH FIELD
// ========================================

function validateField(input, errorElement) {
    const value = input.value.trim();
    let message = "";

    switch (input.id) {
        case "name":
            if (value.length < 2) {
                message = "Name must contain at least 2 characters.";
            }
            break;

        case "email":
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                message = "Enter a valid email address.";
            }
            break;

        case "password":
            if (value.length < 8) {
                message = "Password must be at least 8 characters.";
            }
            break;

        case "confirm-password":
            if (value !== passwordInput.value) {
                message = "Passwords do not match.";
            }
            break;

        case "gender":
            if (!value) {
                message = "Please select your gender.";
            }
            break;

        case "dob":
            if (!value) {
                message = "Please select your date of birth.";
            } else if (value > new Date().toISOString().slice(0, 10)) {
                message = "Date of birth cannot be in the future.";
            }
            break;

        case "country":
            if (!value) {
                message = "Please select your country.";
            }
            break;

        case "phone":
            if (!/^\+?[\d\s()-]{7,20}$/.test(value) ||
                value.replace(/\D/g, "").length < 7 ||
                value.replace(/\D/g, "").length > 15) {
                message = "Enter a valid phone number.";
            }
            break;

        case "bio":
            if (value.length < 5) {
                message = "Bio must contain at least 5 characters.";
            }
            break;
    }

    if (message) {
        showError(input, errorElement, message);
        return false;
    }

    clearError(input, errorElement);
    return true;
}


// ========================================
// 6. VALIDATE AS THE USER TYPES
// ========================================

fields.forEach(({ input, error }) => {
    input.addEventListener("input", () => {
        validateField(input, error);

        // Recheck confirmation when the password changes.
        if (input === passwordInput) {
            validateField(confirmPasswordInput, confirmError);
        }
    });

    input.addEventListener("change", () => {
        validateField(input, error);
    });
});


// ========================================
// 7. UPDATE MEMBER COUNTER
// ========================================

function updateCounter() {
    count.textContent =
        memberList.querySelectorAll(".member-item").length;
}

function removeEmptyMessage() {
    const emptyNote = document.getElementById("emptyNote");

    if (emptyNote) {
        emptyNote.remove();
    }
}

function showEmptyMessageIfNeeded() {
    if (memberList.querySelectorAll(".member-item").length === 0) {
        if (!document.getElementById("emptyNote")) {
            const emptyNote = document.createElement("li");

            emptyNote.className = "empty";
            emptyNote.id = "emptyNote";
            emptyNote.textContent =
                "No members yet. Register someone to begin.";

            memberList.appendChild(emptyNote);
        }
    }
}


// ========================================
// 8. CREATE A MEMBER CARD
// ========================================

function createMember(member) {
    const li = document.createElement("li");
    li.className = "member-item";

    // Store member data on the list item.
    li.memberData = { ...member };

    const info = document.createElement("div");
    info.className = "member-info";

    const heading = document.createElement("h3");
    heading.textContent = member.name;

    const email = document.createElement("p");
    email.textContent = `Email: ${member.email}`;

    const country = document.createElement("p");
    country.textContent = `Country: ${member.country}`;

    info.append(heading, email, country);

    // VIEW DETAILS BUTTON
    const viewButton = document.createElement("button");
    viewButton.type = "button";
    viewButton.textContent = "View Details";

    viewButton.addEventListener("click", () => {
        showMemberDetails(li.memberData);
    });

    // UPDATE BUTTON
    const updateButton = document.createElement("button");
    updateButton.type = "button";
    updateButton.textContent = "Update";

    updateButton.addEventListener("click", () => {
        loadMemberForEditing(li);
    });

    // REMOVE BUTTON
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.className = "remove";

    removeButton.addEventListener("click", () => {
        if (editingMember === li) {
            editingMember = null;
            form.reset();
            clearAllErrors();
            successMsg.classList.add("hidden");
        }

        li.remove();
        updateCounter();
        showEmptyMessageIfNeeded();
    });

    li.append(
        info,
        viewButton,
        updateButton,
        removeButton
    );

    return li;
}


// ========================================
// 9. VIEW MEMBER DETAILS
// ========================================

function showMemberDetails(member) {
    alert(
        "MEMBER DETAILS\n\n" +
        `Name: ${member.name}\n` +
        `Email: ${member.email}\n` +
        `Gender: ${member.gender}\n` +
        `Date of Birth: ${member.dob}\n` +
        `Country: ${member.country}\n` +
        `Phone: ${member.phone}\n` +
        `Bio: ${member.bio}`
    );
}


// ========================================
// 10. LOAD MEMBER FOR UPDATING
// ========================================

function loadMemberForEditing(li) {
    const member = li.memberData;

    nameInput.value = member.name;
    emailInput.value = member.email;
    genderInput.value = member.gender;
    dobInput.value = member.dob;
    countryInput.value = member.country;
    phoneInput.value = member.phone;
    bioInput.value = member.bio;

    // Password fields are deliberately not stored on member cards.
    passwordInput.value = "";
    confirmPasswordInput.value = "";

    editingMember = li;

    clearAllErrors();

    successMsg.textContent =
        "Editing member. Enter a new password, confirm it, then submit to save.";
    successMsg.classList.remove("hidden");

    form.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    nameInput.focus();
}


// ========================================
// 11. REGISTER OR UPDATE A MEMBER
// ========================================

form.addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    fields.forEach(({ input, error }) => {
        if (!validateField(input, error)) {
            isValid = false;
        }
    });

    if (!isValid) {
        const firstInvalid = fields.find(({ input }) =>
            input.classList.contains("invalid")
        );

        if (firstInvalid) {
            firstInvalid.input.focus();
        }

        successMsg.classList.add("hidden");
        return;
    }

    const member = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        gender: genderInput.value,
        dob: dobInput.value,
        country: countryInput.value,
        phone: phoneInput.value.trim(),
        bio: bioInput.value.trim()
    };

    // Save new members or update existing members.
    if (editingMember) {
        editingMember.memberData = { ...member };

        const updatedMember = createMember(member);
        editingMember.replaceWith(updatedMember);

        editingMember = null;

        successMsg.textContent =
            "Member details updated successfully!";
    } else {
        removeEmptyMessage();

        const newMember = createMember(member);
        memberList.appendChild(newMember);

        successMsg.textContent =
            "Registration completed successfully!";
    }

    updateCounter();

    form.reset();
    clearAllErrors();
    successMsg.classList.remove("hidden");
});


// ========================================
// 12. DARK MODE
// ========================================

function setTheme(isDark) {
    document.body.classList.toggle("dark", isDark);

    themeButton.textContent = isDark
        ? "Light Mode"
        : "Dark Mode";

    try {
        localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (error) {
        console.warn("Theme preference could not be saved.");
    }
}

let savedTheme = "light";

try {
    savedTheme = localStorage.getItem("theme") || "light";
} catch (error) {
    console.warn("Saved theme could not be loaded.");
}

setTheme(savedTheme === "dark");

themeButton.addEventListener("click", () => {
    setTheme(!document.body.classList.contains("dark"));
});


// ========================================
// 13. INITIALISE THE APP
// ========================================

updateCounter();
showEmptyMessageIfNeeded();

console.log("Registration application is ready!");