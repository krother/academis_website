// console.log("hello World")
(function () {

    let toggler = document.getElementsByClassName("toggler")[0];
    let navLinks = document.querySelectorAll(".menu-link");
    let showMoreListItemsInNav = document.getElementsByClassName("show-more")[0];
    let subMenuLinks = document.getElementsByClassName("sub-menu-links")[0];

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            toggler.checked = false
        })
    })

    const anchor = document.querySelector('#anchor');
    anchor.scrollIntoView(({ behavior: "smooth" }));
    
    const coursesAnchor = document.querySelector('#courses-anchor');
    coursesAnchor.scrollIntoView(({ behavior: "smooth" }));
    
})();
