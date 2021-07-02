const roles = {}


// -------------------------------------------------------------------------------
// Funciones globales

function minsal_ui_cargar_vista(nombre_vista, preservar = true) {
    if (preservar) {
        vista_actual = nombre_vista;
    }

    $('#contenedorprincipal').load(nombre_vista + '.html', () => {
        if (preservar) {
            window.document.title = 'Registro de Vacuna - ' + nombre_vista;
            window.location.hash = '#' + vista_actual;
        }
    });
}

function minsal_set_cookie_key(cookie, key, value) {
    var obj = JSON.parse(getCookie(cookie));
    obj[key] = value;
    setCookie(cookie, JSON.stringify(obj));
}

function minsal_get_cookie_key(cookie, key, value) {
    var obj = JSON.parse(getCookie(cookie));
    return obj[key] && obj[key] || value;
}

function minsal_cambio_rol(id_rol) {
    minsal_set_cookie_key('edata', 'rol', id_rol);
}

function usuario_get_id() {
    return minsal_get_cookie_key('edata', 'id_usuario', null);
}

function minsal_modal(titulo, mensaje) {
    $('<div class="modal" tabindex="-1" role="dialog" style="display: none;"> \
        <div class="modal-dialog" role="document"> \
            <div class="modal-content"> \
                <div class="modal-header"> \
                    <h5 class="modal-title">'+titulo+'</h5> \
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"> \
                        <span aria-hidden="true">&times;</span> \
                    </button> \
                </div> \
                <div class="modal-body"> \
                    <p>'+mensaje+'</p> \
                </div> \
                <div class="modal-footer"> \
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Entendido</button> \
                </div> \
            </div> \
        </div> \
    </div>').modal();
}


// -------------------------------------------------------------------------------
// Metodos REST

function minsal_put(endpoint, callback_success, callback_error, data_raw = null) {
    minsal_request(endpoint, 'PUT', callback_success, callback_error, data_raw)
}

function minsal_post(endpoint, callback_success, callback_error, data_raw = null) {
    minsal_request(endpoint, 'POST', callback_success, callback_error, data_raw)
}

function minsal_delete(endpoint, callback_success, callback_error, data_raw = null) {
    minsal_request(endpoint, 'DELETE', callback_success, callback_error, data_raw)
}

function minsal_get(endpoint, callback_success, callback_error, data_raw = null) {
    minsal_request(endpoint, 'GET', callback_success, callback_error, data_raw)
}

function minsal_get_cached(endpoint, callback_success, callback_error, data_raw = null) {
    minsal_request(endpoint, 'GET', callback_success, callback_error, data_raw, true)
}

function minsal_request(endpoint, method, callback_success, callback_error, data_raw, cached) {
    cached = (typeof cached !== 'undefined') ?  cached : false;
    let options = {
        url: api_url + endpoint,
        method: method,
        cache: cached,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': getCookie('token') || ''
        },
        success: function (msg) {
            callback_success(msg);
        },
        error: function (jqXHR, status, err) {
            callback_error(jqXHR, status, err);
        },
    }

    if (data_raw) {
        options['data'] = JSON.stringify(data_raw);
    }

    $.ajax(options);
}

// ----------------------------------------------------------------

function localDate(iso8601) {
    var dateParts = iso8601.split("-");
    var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
    return jsDate.toLocaleDateString('es-SV');
}

function removerSegundos(hora24) {
    return hora24.replace(/(\d\d:\d\d):\d\d/, '$1');
}