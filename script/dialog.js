hq.load = function(path, callback, data, message) {
    var err = function(jqXHR, status, err) {
        hq.dialog({
            action: 'Error loading '+path,
            form: [,
                {type: 'button', text: "Close"},
                {type: 'button', click: function() {hq.load(path, callback, data, message);}, text: "Retry"},
                err || status
            ]
        });
    };
    var xhr = $.ajax({
        url: hq.base_url + '/' + path,
        type: 'post',
        error: err,
        dataType: 'json',
        data: data,
        success: function(data) {
            if(typeof data !== 'object')
                return err(xhr, null, 'No data recieved');
            return callback(data);
        }
    });
    
    if(message) {
        hq.dialog({
            action: message,
            form: [
                {type: 'button', click: function() {xhr.abort();}, text: "Stop"},
                {type: 'message', text: 'Press Stop to cancel this operation'}
            ]
        });
    }
};

hq.dialogCloseTimeout = null;

hq.dialog = function(o) {
    
    // Prevent from closing if a new dialog was opened
    window.clearTimeout(hq.dialogCloseTimeout);
    
    // Close dialog
    if(o === null) {
        hq.dialogCloseTimeout = window.setTimeout(function() { $("#hq-dialog").fadeOut(); }, 100);
        return;
    }
    
    if(typeof o !== 'object')
        o = {};
    
    $form = $("#hq-dialog .form");
    if(o.form) {
        $form.html('');
        for(var i = 0; i < o.form.length; i++) {
            var item = o.form[i];
            if(typeof item !== 'object')
                item = {type: 'message', text: item};
            switch(item.type) {
                case 'message':
                    if(item.text && item.text.length > 0)
                        $('<div>').addClass('message').text(item.text).appendTo($form);
                    break;
                case 'password':
                    var itype = 'password';
                case 'input':
                    var itype = itype || 'text';
                    if(item.label && item.label.length > 0)
                        $('<div>').addClass('label').text(item.label).appendTo($form);
                    var inp = $('<input>');
                    inp.attr('type', itype);
                    inp.attr('name', item.name);
                    inp.appendTo($form);
                    break;
                case 'button':
                    $('<div>').addClass('button').text(item.text || 'Button')
                        .click(hq.dialogButton(item.click)).appendTo($form);
                    break;
            }
        }
        $('<div>').addClass('clearfix').appendTo($form);
        $form.show();
    } else {
        $form.hide();
    }
    
    $("#hq-dialog").stop(true).show();
    
    if(o.action && o.action.length)
        $("#hq-dialog .action").show().css('opacity', 0.2).text(o.action).animate({opacity:1});
    else
        $("#hq-dialog .action").hide().text('');
};

hq.dialogButton = function(func) {
    return function() {
        var v = true;
        hq.dialog(null);
        if(typeof func === 'function')
            v = func();
        // Close unless prevented
        if(v === false)
            window.clearTimeout(hq.dialogCloseTimeout);
    };
}

hq.dialogError = function(name, err) {
    alert(err);
}

// Some standard dialogs
hq.dialogs = {
    apiFailure: {action: 'API Failure: Please reload the page'},
    login: {form: [
        {type: 'input', name: 'email', label: 'Email Address'},
        {type: 'password', name: 'password', label: 'Password'},
        'Enter your email address and password to login',
        {type: 'button', text: 'Login', click: hq.tryLogin}
    ]},
    loggedOut: {action: 'You have been successfully logged out', form: [
        'To login again, press Continue',
        {type: 'button', text: 'Continue', click: function(){hq.dialog(hq.dialogs.login);}}
    ]},
    loggingIn: {action: 'Checking your credentials'}
};
