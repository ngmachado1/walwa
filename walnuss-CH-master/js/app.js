const navSlide = () => {
    const menu = document.querySelector('.menu');
    const nav = document.querySelector('.link-items');
    const contact = document.querySelector('.contacto');
    const navLinks = document.querySelectorAll('.link-items li');
    const navBack = document.querySelector('nav');
    //toggle Nav
    menu.addEventListener('click', () => {
        nav.classList.toggle('link-items-active');

        //animate links

        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = ''
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 6 + 0.5}s`;
            }
        });
        //menu animate
        menu.classList.toggle('toggle');

        navBack.classList.toggle('active');
    });
    //animate links


}

navSlide();

//  menu carrito desplegable
function openNav() {
    if (screen.width < 500) {
        document.getElementById("myCart").style.width = "350px";
    }
    else {
        document.getElementById("myCart").style.width = "500px";
    }
}
function closeNav() {
    document.getElementById("myCart").style.width = "0";
}

///////////////////////////////

function addToCart(id) {
    var product = products.getById(id)[0];
    shoppingCart.add(product);
}

function removeToCart(id){
    var product = products.getById(id)[0];
    shoppingCart.removing(product);
}
function removeallToCart(id){
    shoppingCart.deleteProducts(id);
}

 
window.onload = function () {

    // var urlLocal = `https://ngmachado1.github.io/walnuss-CH/js/data.json`;
    var urlLocal = `js/data.json`;

    $.ajax({
        method: "GET",
        url: urlLocal
    }).done(function(data){
        
        //products
        var dataProduct = data[0].dataProduct;
        products = new Products(data);
        products.init(dataProduct);
        products.buildList('products-container', 'dataProduct');
        
        //detalle de producto
        // var detalle = data[0].detalle;
        // document.querySelector('.icon-chevron-left').addEventListener('click', () => {
        //     moveLeft(detalle);
        // });
        // document.querySelector('.icon-chevron-right').addEventListener('click', () => {
        //     moveRight(detalle);
        // });

    }).fail(function(error){
        error = alert('no se establecio la conexion');
    })


    shoppingCart = new ShoppingCart();
    shoppingCart.populate();
    shoppingCart.buildCart('cart-container');
    shoppingCart.total('total');

}