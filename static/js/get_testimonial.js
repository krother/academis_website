
function load_testimonial() {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "/testimonials/", false);
    xmlHttp.send(null);

    tag = document.getElementById("testimonials");
    tag.innerHTML = xmlHttp.responseText;
}
