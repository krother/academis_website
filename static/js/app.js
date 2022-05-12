(function () {

    const toggler = document.getElementsByClassName("toggler")[0];
    const navLinks = document.querySelectorAll(".menu-link");
    const navbar = document.querySelector("nav");
    const coursesImg = Array.from(document.getElementsByClassName('courses-img'));

    console.log(coursesImg[0].src)

    coursesImg.forEach(img => {
        img.addEventListener('mouseover', (e) => {
            e.target.src = "../static/images/vortex.gif"
            setTimeout(() => {
                e.target.src = "../static/images/science.png"
            }, 7200)
        })
    });
        

    toggler.addEventListener("click", () => {
        navbar.classList.toggle("off")
    })

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            toggler.checked = false;
            navbar.classList.add("off")
        })
    });

})();
