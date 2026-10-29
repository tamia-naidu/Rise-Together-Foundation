
/* =====================================================
   RISE TOGETHER FOUNDATION
   PART 3 - JAVASCRIPT FUNCTIONALITY
===================================================== */

/* =====================================================
   1. GALLERY SEARCH
===================================================== */

const gallerySearch = document.getElementById("gallerySearch");
const galleryMessage = document.getElementById("gallerySearchMessage");

if (gallerySearch) {
    const galleryItems = document.querySelectorAll(".gallery-item");

    function filterGallery() {
        const searchTerm = gallerySearch.value.trim().toLowerCase();
        let visibleCount = 0;

        galleryItems.forEach(function (item) {
            const caption = item.textContent.toLowerCase();
            const matches = caption.includes(searchTerm);

            item.hidden = !matches;

            if (matches) {
                visibleCount++;
            }
        });

        if (galleryMessage) {
            galleryMessage.textContent =
                visibleCount === 0
                    ? "No gallery activities match your search."
                    : visibleCount + " gallery item(s) found.";
        }
    }

    gallerySearch.addEventListener("input", filterGallery);
}


/* =====================================================
   2. GALLERY IMAGE LIGHTBOX
===================================================== */

const galleryImages = document.querySelectorAll(".gallery-item img");

if (galleryImages.length > 0) {
    const lightbox = document.createElement("div");

    lightbox.id = "imageLightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Enlarged gallery image");
    lightbox.hidden = true;

    lightbox.innerHTML = `
        <button type="button" id="closeLightbox"
                aria-label="Close enlarged image">&times;</button>
        <figure>
            <img id="lightboxImage" src="" alt="">
            <figcaption id="lightboxCaption"></figcaption>
        </figure>
    `;

    document.body.appendChild(lightbox);

    const largeImage = document.getElementById("lightboxImage");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const closeButton = document.getElementById("closeLightbox");

    let previouslyFocused = null;

    function closeLightbox() {
        lightbox.hidden = true;
        document.body.style.overflow = "";

        if (previouslyFocused) {
            previouslyFocused.focus();
        }
    }

    galleryImages.forEach(function (image) {
        image.tabIndex = 0;
        image.setAttribute("role", "button");
        image.setAttribute("aria-label", "Enlarge: " + image.alt);

        function openLightbox() {
            previouslyFocused = image;

            largeImage.src = image.src;
            largeImage.alt = image.alt;
            lightboxCaption.textContent =
                image.closest("figure")?.querySelector("figcaption")?.textContent
                || image.alt;

            lightbox.hidden = false;
            document.body.style.overflow = "hidden";
            closeButton.focus();
        }

        image.addEventListener("click", openLightbox);

        image.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox();
            }
        });
    });

    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (!lightbox.hidden && event.key === "Escape") {
            closeLightbox();
        }
    });
}



/* =====================================================
   3. FAQ ACCORDION - ABOUT PAGE
===================================================== */

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(function (question) {

    const answer = question.nextElementSibling;

    if (answer && answer.classList.contains("faq-answer")) {

        question.setAttribute("aria-expanded", "false");
        answer.hidden = true;

        question.addEventListener("click", function () {

            const isOpen =
                question.getAttribute("aria-expanded") === "true";

            answer.hidden = isOpen;

            question.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

        });
    }
});

/* =====================================================
   4. FORM VALIDATION AND RESPONSE
===================================================== */

function showFormMessage(form, message, isError) {
    let output = form.querySelector(".form-feedback");

    if (!output) {
        output = document.createElement("p");
        output.className = "form-feedback";
        output.setAttribute("role", "status");
        output.setAttribute("aria-live", "polite");
        form.appendChild(output);
    }

    output.textContent = message;
    output.style.color = isError ? "#B00020" : "#1E3A5F";
}

function validateForm(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const messageInput = form.querySelector("textarea");

    if (!form.checkValidity()) {
        form.reportValidity();
        showFormMessage(
            form,
            "Please check the required fields and correct the highlighted information.",
            true
        );
        return false;
    }

    if (emailInput) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(emailInput.value.trim())) {
            emailInput.setCustomValidity("Please enter a valid email address.");
            emailInput.reportValidity();
            emailInput.setCustomValidity("");

            showFormMessage(form, "Please enter a valid email address.", true);
            return false;
        }
    }

    if (phoneInput && phoneInput.value.trim() !== "") {
        const phonePattern = /^[0-9+()\s-]{7,20}$/;

        if (!phonePattern.test(phoneInput.value.trim())) {
            phoneInput.setCustomValidity(
                "Please enter a valid phone number."
            );
            phoneInput.reportValidity();
            phoneInput.setCustomValidity("");

            showFormMessage(form, "Please enter a valid phone number.", true);
            return false;
        }
    }

    if (messageInput && messageInput.value.trim().length < 10) {
        showFormMessage(
            form,
            "Please provide a little more detail in your message (at least 10 characters).",
            true
        );

        messageInput.focus();
        return false;
    }

    return true;
}


/* =====================================================
   5. ENQUIRY FORM
===================================================== */

const enquiryForm = document.getElementById("enquiryForm");

if (enquiryForm) {
    enquiryForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!validateForm(enquiryForm)) {
            return;
        }

        const nameInput = enquiryForm.querySelector(
            'input[name="name"]'
        );

        const firstName = nameInput
            ? nameInput.value.trim().split(/\s+/)[0]
            : "there";

        showFormMessage(
            enquiryForm,
            "Thank you, " + firstName +
            "! Your enquiry has passed validation. Please use the organisation's contact details to send it, or connect this form to a submission service to receive enquiries online.",
            false
        );
    });
}


/* =====================================================
   6. CONTACT FORM
===================================================== */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!validateForm(contactForm)) {
            return;
        }

        const formData = new FormData(contactForm);

        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const message = String(formData.get("message") || "").trim();

        const subject = encodeURIComponent(
            "Website enquiry from " + name
        );

        const body = encodeURIComponent(
            "Name: " + name + "\n" +
            "Email: " + email + "\n\n" +
            "Message:\n" + message
        );

        const recipient = "info@risetogetherfoundation.org";

        showFormMessage(
            contactForm,
            "Your message has been validated. Your email application will open so you can review and send it.",
            false
        );

        window.location.href =
            "mailto:" + recipient +
            "?subject=" + subject +
            "&body=" + body;
    });
}

