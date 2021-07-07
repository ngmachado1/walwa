function ShoppingCart() {
    //una lista que guarda los elementos
    this.cart = [];

    //local storage que trae los elementos que hay en localstorage
    this.populate = function () {
        this.cart = (localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : [];
        this.changeIcon()
    }

    //metodo que llena el array
    this.add = function (item) {
        this.cart.push(item);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.buildCart('cart-container');
        this.total('total');
        this.changeIcon();
    }


    //remueve un elemento por id
    this.removing = function(id){
        var removeIndex = this.cart.findIndex(x => x.id === id.id);
        this.cart.splice(removeIndex, 1);

        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.buildCart('cart-container');
        this.total('total');

    }
    //remueve todos los elementos con el mismo id
    this.deleteProducts = function (id){
        var carrito = this.cart.filter(function(product){
            return product.id !== id
        });
        //filtro + reasignacion
        this.cart=carrito;
        
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.buildCart('cart-container');
        this.total('total');
        this.changeIcon();
    }
    

    //sumo elementos
    this.suma = function(){
        var suma = 0;
        if (localStorage.getItem('cart')) {
          var elementos = this.cart;
            for (var a=0; a<elementos.length; a++){
                suma += Number(elementos[a].precio);
            };
        }
        return suma;
    }

    //calcular el total del carrito
    this.total = function(containerId) {
        var container = document.getElementById(containerId);
        container.innerHTML = "";
        var html = `
        <div class="subtotal">
        <h6>subtotal</h6>
        <h6>$${this.suma()}</h6>
        </div>
        <hr>
        <div class="extras">
        <h6>envio</h6>
        <h6>$50</h6>
        </div>
        <hr>
        <div class="total">
        <h6>total</h6>
        <h6>$${this.suma() + 50}</h6>
        </div>

        `
        container.innerHTML = html;
    }

    
    //metodo para reorganizar un array separando sus items por una propidad determinada.

    this.groupByEl = function(unArray, prop) {
        return unArray.reduce((elementos, item) =>{
            var valor = item[prop];
            elementos[valor] = elementos[valor] || {id: item.id, nombre: item.nombre, cantidad: 0, precio: 0, descripcion: item.descripcion, imagen: item.imagen};
            elementos[valor].precio += item.precio;
            elementos[valor].cantidad += item.cantidad;

            return elementos;
        }, {});
    }


    this.buildList = function () {
        //separo el array this.cart en objetos x id
        var group = this.groupByEl(this.cart, 'id');
        console.log(group)
        var html = '';
        //render
        for(var propiedad in group) {


            html = html + `                
            
            <div class="prod pro1">
                <img src="${group[propiedad].imagen}" alt="">
            </div>
            <div class="prod pro2">
                <h6>${group[propiedad].nombre}</h6>
                <p>${group[propiedad].descripcion}</p>
            </div>
            <div class="prod">
                <div class="pro3">
                    <h6 style="cursor: pointer;" onclick="removeToCart(${group[propiedad].id})">-</h6>
                    <h6 style="cursor: pointer;" id="cart-number">${group[propiedad].cantidad}</h6>
                    <h6 style="cursor: pointer;" onclick="addToCart(${group[propiedad].id})">+</h6>
                </div>
                <button class="remove" onclick="removeallToCart(${group[propiedad].id})" >Quitar</button>
            </div>
            <div class="prod pro4">
                <h6>$${group[propiedad].precio}</h6>
            </div>
            <hr>
         `;
        };
        return html;
    }
    //render final para ejecutar en this.add
    this.buildCart = function (containerId) {
        var container = document.getElementById(containerId);
        container.innerHTML = "";
        var html = 
        `<article class="grid-pro" class="cart-container">
                ${ this.buildList() }
        </article> `

        container.innerHTML = html;
    }
    this.changeIcon = function (){
        var icono = $('#carroDeCompras');
        var span = $('.cantidadDeP');
        var cont = $('.cantidadDeProductos');
        if (this.cart.length >= 1 ) {
            icono.removeClass('icon-carro-vacio');
            icono.addClass('icon-carros-lleno');
            span.html(`${this.cart.length}`)
            cont.show();
            $('.comprar').attr('disabled', false);

        }else{
            icono.removeClass('icon-carros-lleno');
            icono.addClass('icon-carro-vacio');
            cont.hide();
            $('.comprar').attr('disabled', true);
        }
    }

}
