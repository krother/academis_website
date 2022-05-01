// console.log("hello World")
(function () {

    let toggler = document.getElementsByClassName("toggler")[0];
    let navLinks = document.querySelectorAll(".menu-link");
    let showMoreListItemsInNav = document.getElementsByClassName("show-more")[0];
    let subMenuLinks = document.getElementsByClassName("sub-menu-links")[0];
    let offOnToggler = document.getElementsByClassName("off-on-toggler");
    let navbar = document.querySelector("nav");

    // offOnToggler.addEventListener("click", () => {
    //     console.log("hello")
    // })

    toggler.addEventListener("click", () => {
        navbar.classList.toggle("off")
        // console.log("hello")
    })

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            toggler.checked = false
        });
        navbar.classList.add("off");
    })

    const anchor = document.querySelector('#anchor');
    anchor.scrollIntoView(({ behavior: "smooth" }));
    
    const coursesAnchor = document.querySelector('#courses-anchor');
    coursesAnchor.scrollIntoView(({ behavior: "smooth" }));

    const contactAnchor = document.querySelector('#contact');
    contactAnchor.scrollIntoView(({ behavior: "smooth" }));
    
})();
