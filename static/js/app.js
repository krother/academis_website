(function () {

    const toggler = document.getElementsByClassName("toggler")[0];
    const navLinks = document.querySelectorAll(".menu-link");
    const navbar = document.querySelector("nav");

    toggler.addEventListener("click", () => {
        navbar.classList.toggle("off")
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
