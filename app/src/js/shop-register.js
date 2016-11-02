define(['doc', 'modal', 'ajax', 'form', 'ENV'], function($, $modal, ajax, form, ENV) {
    'use strict'

    var $form = $('#registerForm');

    $('#hasInternetDevice').on('change', function() {
        var isChecked = this.checked;

        $form.find('.required').toggleClass('disabled');
        $form.find('.fab').toggleClass('fab-disabled');

        $form.find('.mandatory').each(function(element) {
            element.disabled = !isChecked;
        });
    });

    form.mask($form.find('.cep').first(), "#####-###", form.CEP_SIZE);
    form.mask($form.find('.cnpj').first(), "##.###.###/####-##", form.CNPJ_SIZE);

    $form.find('#shopPicture').on('change', function() {
        if (this.files && this.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $form.find('.preview').attr('src', e.target.result);
            }

            reader.readAsDataURL(this.files[0]);
        }
    });

    form.validate('#registerForm', {
        success: function(event) {
            event.preventDefault;

            var $fab = $form.find('.bt-confirm-register');

            $fab.first().disabled = true;
            $fab.addClass('loading');

            var preMarket = {
                name: $form.find('[name="name"]').val(),
                cnpj: $form.find('[name="cnpj"]').val(),
                email: $form.find('[name="email"]').val(),
                address: {
                    cep: $form.find('[name="cep"]').val(),
                    state: $form.find('[name="state"]').val(),
                    city: $form.find('[name="city"]').val(),
                    address: $form.find('[name="address"]').val(),
                    number: $form.find('[name="number"]').val(),
                    neighborhood: $form.find('[name="neighborhood"]').val()
                },
                hasDelivery: $form.find('[name="hasDelivery"]').first().checked
            };

            ajax.post(ENV.api.premarkets, preMarket, {
                'success': function(response, xhr) {
                    $modal.show('.modal-success', function() {
                        $form.find('.required').addClass('disabled');
                        $form.find('.fab').addClass('fab-disabled');

                        $form.find('.mandatory').each(function(element) {
                            element.disabled = true;
                        });
                    });
                },
                'error': function(response, xhr) {
                    showError(".error-api-message");
                },
                'complete': function(xhr) {
                    $fab.first().disabled = false;
                    $fab.removeClass('loading');
                }
            },{
                async: true,
                headers : {
                    "Content-Type": "application/json"
                }
            });
        },
        error: function() {
            showError(".empty-fields-message");
        }
    });

    var showError = function(messageClass) {
        var $invalidMessage = $form.find(messageClass);
        $invalidMessage.toggleClass('hide');
        setTimeout(function() {
            $invalidMessage.addClass('hide');
        },4000);
    }

});