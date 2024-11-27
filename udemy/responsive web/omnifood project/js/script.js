//
//
//
//
//
//
//
//
//
//
///////////////////////////////////////////////////////////
// keep the copyright year up to date.
const copyrightYearEl = document.querySelector(".year");
const currentYear = new Date().getFullYear();
copyrightYearEl.textContent = currentYear;

///////////////////////////////////////////////////////////
// make mobile nav work
const navBtnEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector("header");
navBtnEl.addEventListener("click", function () {
    // the abstraction of toggle... god damn.
    headerEl.classList.toggle("nav-open");
});

///////////////////////////////////////////////////////////
// smooth scrolling in safari
const allLinks = document.querySelectorAll("a:link");
allLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const href = link.getAttribute("href");

        if (href === "#")
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

        //scroll to other links
        if (href !== "#" && href.startsWith("#")) {
            const sectionEl = document.querySelector(href);
            sectionEl.scrollIntoView({ behavior: "smooth" });
        }

        // close mobile nav
        if (link.classList.contains("close-nav")) {
            headerEl.classList.toggle("nav-open");
        }
    });
});
