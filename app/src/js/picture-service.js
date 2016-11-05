define('pictureService', ['ajax', 'ENV'], function(ajax, ENV) {
    'use strict'

    return {
        'store': function(file, callback) {
            var formData = new FormData();
            formData.append("file", file);

            var xhr = new XMLHttpRequest();
            xhr.open("POST", ENV.api.premarketsPicture, true);
            xhr.addEventListener("load", function (response) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    callback.success.call(this, xhr.responseText);
                } else {
                    callback.error.call(this);
                }
            });
            xhr.send(formData);
        }
    }
});