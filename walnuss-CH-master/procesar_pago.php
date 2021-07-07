
<?php
    require_once 'vendor/autoload.php';

    MercadoPago\SDK::setAccessToken("TEST-6557075858828359-071515-371c045a25d96560fa82a24e0b87398f-176377692");

    $payment = new MercadoPago\Payment();
    $payment->transaction_amount = 120;
    $payment->token = "ff8080814c11e237014c1ff593b57b4d";
    $payment->description = "Practical Bronze Lamp";
    $payment->installments = 1;
    $payment->payment_method_id = "visa";
    $payment->payer = array(
    "email" => "patsy.wolff@yahoo.com"
    );

    $payment->save();


    echo $payment->status;

?>