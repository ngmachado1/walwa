



function procesarCompra() {

    comprar.click(function () {

        //traer el carrito de localStorage
        var elementos = (localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : [];
        //procesar la compra
        carrito.slideToggle('slow');
        var that = $(this);
        var texto = that.html();
        if (texto == 'Volver') {
            that.html('<span class="icon-carro-lleno boton"></span> Comprar');
            resumenContainer.html('');
        } else {
            that.html('Volver');
            resumenContainer.html(`
            <div class="permanente">
                <div class="dinamico">
                    <h6>Elegí como queres pagar:</h6>
                    <div class="botones">
                        <button class="pago" id="efectivo" data-fdp="Efectivo">
                            <img src="images/carpeta-iconos/wallet.svg" data-fdp="Efectivo">                            
                        </button>
                        <button class="pago" id="mercado-pago" data-fdp="Mercado-pago">
                            <img src="images/carpeta-iconos/mercadopago.svg" data-fdp="Mercado-pago">
                        </button>
                    </div>
                </div>
            </div>
            `);
        };



        var botonPago = $('.pago');
        var dinamico = $('.dinamico');
        var permanente = $('.permanente');
        botonPago.click(function (event) {



            var payment = $(event.target).data("fdp");
            if (payment === "Mercado-pago") {
                dinamico.slideUp('slow');
                permanente.html(`
                    <form action="/procesar_pago.php" method="post" id="pay" name="pay" >
                            <p>
                                <label for="description">Descripción</label><br>                       
                                <input class="inputName" type="text" name="description" id="description" value="Wallnuss Cerveza Artesanal"/>
                            </p>                    
                            <p>
                                <label for="transaction_amount">Monto a pagar</label><br>                      
                                <input class="inputName" name="transaction_amount" id="transaction_amount" value="${shoppingCart.suma() + 50}"/>
                            </p>
                            <p>
                                <label for="cardNumber">Número de la tarjeta</label><br>
                                <input class="inputName" type="text" id="cardNumber" data-checkout="cardNumber" onselectstart="return false" onCut="return false" onDrag="return false" onDrop="return false" />
                            </p>
                            <p>
                                <label for="cardholderName">Nombre y apellido</label><br>
                                <input class="inputName" type="text" id="cardholderName" data-checkout="cardholderName" />
                            </p>                                    
                            <p>
                                <label for="cardExpirationMonth">Mes de vencimiento</label><br>
                                <input class="inputName" type="text" id="cardExpirationMonth" data-checkout="cardExpirationMonth" onselectstart="return false" onpaste="return false"  onCut="return false" onDrag="return false" onDrop="return false"/>
                            </p>
                            <p>
                                <label for="cardExpirationYear">Año de vencimiento</label><br>
                                <input class="inputName" type="text" id="cardExpirationYear" data-checkout="cardExpirationYear" onselectstart="return false" onpaste="return false"  onCut="return false" onDrag="return false" onDrop="return false"  />
                            </p>
                            <p>
                                <label for="securityCode">Código de seguridad</label><br>
                                <input class="inputName" type="text" id="securityCode" data-checkout="securityCode" onselectstart="return false" onpaste="return false" onCut="return false" onDrag="return false" onDrop="return false" />
                            </p>
                            <p>
                                <label for="installments">Cuotas</label><br>
                                <select class="inputName" id="installments" class="form-control" name="installments"></select>
                            </p>
                            <p>
                                <label for="docType">Tipo de documento</label><br>
                                <select class="inputName" id="docType" data-checkout="docType"></select>
                            </p>
                            <p>
                                <label for="docNumber">Número de documento</label><br>
                                <input class="inputName" type="text" id="docNumber" data-checkout="docNumber" placeholder=""/>
                            </p>
                            <p>
                                <label for="email">Email</label><br>
                                <input class="inputName" type="email" id="email" name="email" value="test@test.com"/>
                            </p>  
                            <input type="hidden" name="payment_method_id" id="payment_method_id"/>
                            <button type="submit" id="confirmar" class="regular" value="Pagar"/>Pagar</button>
                    </form>

                `)

                //API MERCADOPAGO
                window.Mercadopago.setPublishableKey("TEST-34a34a05-ff5e-4a25-820d-33adf7b29e5c");
                //Obtener tipos de documentos
                window.Mercadopago.getIdentificationTypes();
                //Obtener método de pago de la tarjeta
                document.getElementById('cardNumber').addEventListener('keyup', guessPaymentMethod);
                document.getElementById('cardNumber').addEventListener('change', guessPaymentMethod);

                function guessPaymentMethod(event) {
                    let cardnumber = document.getElementById("cardNumber").value;

                    if (cardnumber.length >= 6) {
                        let bin = cardnumber.substring(0, 6);
                        window.Mercadopago.getPaymentMethod({
                            "bin": bin
                        }, setPaymentMethod);
                    }
                };

                function setPaymentMethod(status, response) {
                    if (status == 200) {
                        let paymentMethodId = response[0].id;
                        let element = document.getElementById('payment_method_id');
                        element.value = paymentMethodId;
                        getInstallments();
                    } else {
                        alert(`payment method info error: ${response}`);
                    }
                }

                //        Obtener cantidad de cuotas
                function getInstallments(){
                    window.Mercadopago.getInstallments({
                        "payment_method_id": document.getElementById('payment_method_id').value,
                        "amount": parseFloat(document.getElementById('transaction_amount').value)
                
                    }, function (status, response) {
                        if (status == 200) {
                            document.getElementById('installments').options.length = 0;
                            response[0].payer_costs.forEach( installment => {
                                let opt = document.createElement('option');
                                opt.text = installment.recommended_message;
                                opt.value = installment.installments;
                                document.getElementById('installments').appendChild(opt);
                            });
                        } else {
                            alert(`installments method info error: ${response}`);
                        }
                    });
                }

                //      5. Crea el token de la tarjeta
                doSubmit = false;
                document.querySelector('#pay').addEventListener('submit', doPay);
                
                function doPay(event){
                    event.preventDefault();
                    if(!doSubmit){
                        var $form = document.querySelector('#pay');
                
                        window.Mercadopago.createToken($form, sdkResponseHandler);
                
                        return false;
                    }
                };
                
                function sdkResponseHandler(status, response) {
                    if (status != 200 && status != 201) {
                        alert("verify filled data");
                    }else{
                        var form = document.querySelector('#pay');
                        var card = document.createElement('input');
                        card.setAttribute('name', 'token');
                        card.setAttribute('type', 'hidden');
                        card.setAttribute('value', response.id);
                        form.appendChild(card);
                        doSubmit=true;
                        form.submit();
                    }
                };
                
                




            } else {
                dinamico.slideUp('slow');
                permanente.html(`
    
                <h6>Ingresá tus datos:</h6>
                <form action="#" name="formPedido" id="Confirm">
                    <ul>
                        <li>
                            <input type="text" class="inputName" name="nombre" placeholder="Nombre">
                        </li>
                        <li>
                            <input type="text" class="inputName" name="telefono" placeholder="Teléfono">
                        </li>
                        <li>
                            <input type="text" class="inputName" name="direccion" placeholder="Dirección">
                        </li>
                        <li>
                            <textarea id="" cols="" rows="3"  name="notas" placeholder="Notas al repartidor (OPCIONAL)"></textarea>
                        </li>
                    </ul>
    
                    <button type="submit" class="regular" id="confirmar">Confirmar Pedido!</button>
    
                </form>
                `);
            }


            var confirmar = $('#confirmar');

            confirmar.click(function () {
                $('form[name="formPedido"]').validate({
                    rules: {
                        nombre: {
                            required: true
                        },
                        telefono: {
                            required: true,
                            minlength: 10,
                        },
                        direccion: {
                            required: true
                        },
                        notas: {
                            required: false
                        }
                    },
                    messages: {
                        nombre: {
                            required: 'Ingresá tu Nombre'
                        },
                        telefono: {
                            required: 'Ingresá tu Teléfono',
                            minlength: 'Debe tener mínimo 10 caracteres'
                        },
                        direccion: {
                            required: 'Ingresá tu Direccion'
                        }
                    },
                    submitHandler: function (form) {
                        $('#Confirm').slideUp('slow', function () {
                            var name = $('input[name="nombre"]').val();
                            var tel = $('input[name="telefono"]').val();
                            var dir = $('input[name="direccion"]').val();
                            var notas = $('textarea[name="notas"]').val();

                            var suma = 50;
                            if (localStorage.getItem('cart')) {
                                for (var a = 0; a < elementos.length; a++) {
                                    suma += Number(elementos[a].precio);
                                };
                            };

                            permanente.html(`
                            <h6>¡¡Gracias por tu compra ${name}!!</h6>
                            <div class="gif">
                            <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
                            <lottie-player src="https://assets7.lottiefiles.com/datafiles/QvFXU1UQnXcp6XJ/data.json" background="transparent" speed="1" style="width: 300px; height: 300px;" autoplay></lottie-player>
                            </div>
                            <h6> Resumen de Compra </h6>
                            <div class="resumen">
                            <p>Total de compra: $${suma} </p>
                            <p>Tu pago es con:  ${payment} </p>
                            <p>Nombre: ${name} </p>
                            <p>Teléfono: ${tel} </p>
                            <p>Dirección: ${dir} </p>
                            <p>Notas: ${notas} </p>

                            </div>
                            <a href="https://api.whatsapp.com/send?phone=+5493816444444&text=Hola!%20te%20hice%20un%20pedido%20por%20la%20web%20Mis%20datos:${name}%20total%20Compra:%20${suma}%20Telefono:%20${tel}%20Direccion:%20${dir}">
                            <button class="regular">Chateanos acá</button>
                            </a>
                            `);
                        });
                    }
                });
            });
        });

    });
};


// function mayorEdad() {
//     if (sessionStorage.getItem('mayor')) {
//         tapon.addClass('displayNone');
//         contenedor.removeClass('displayNone');
//     } else {
//         si.click(function () {
//             tapon.addClass('displayNone');
//             contenedor.removeClass('displayNone');
//             sessionStorage.setItem('mayor', JSON.stringify('si'));
//         })
//         no.click(function () {
//             tapon.html(`<h1> volve cuando seas mayor</h1>`);
//         })
//     }

// }


$(function () {


    carrito = $('.carritoRender');
    comprar = $('.comprar');
    resumenContainer = $('.compra');
    procesarCompra();


    contenedor = $('.contenedor-total');
    tapon = $('.seguridad');
    si = $('#si');
    no = $('#no');
    

});

