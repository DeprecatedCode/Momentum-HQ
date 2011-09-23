$(function(){

    $(".dialog").css('boxShadow', '0 0 0px #fff')
        .animate({ boxShadowBlur: 2, boxShadowSpread: 2 }, 200);
    
    hq.init();
});

var hq = {
    
    member: null,
    
    init: function() {
        
        // Check for Momentum API
        if(!e.app || typeof e.app.members !== 'object' || typeof e.app.members.current !== 'function')
            return hq.dialog(hq.dialogs.apiFailure);
        
        // Check login session
        hq.dialog({action: 'Checking session authentication'});
        e.app.members.current(hq.checkLogin);
    },
    
    checkLogin: function(err, member) {
        if(member && member.admin) {
            hq.member = member;
            hq.toolbar();
            hq.showPanel('main');
        } else {
            hq.dialog(hq.dialogs.login);
        }
    },
    
    checkAdminLogin: function(err, member) {
        if(err)
            alert(err);
        console.log(err, member);
        hq.checkLogin(null, member);
    },
    
    tryLogin: function() {
        var email = $('#hq-dialog input[name=email]').val();
        var password = $('#hq-dialog input[name=password]').val();
        
        if(email.length < 4 || email.indexOf('@') < 1 || email.indexOf('.') < 4) {
            hq.dialogError('email', 'Invalid email address');
            return false;
        }
                
        if(password.length < 4) {
            hq.dialogError('password', 'Password is too short');
            return false;
        }
        
        e.app.members.login({email: email, password: password, requireAdmin: true}, hq.checkAdminLogin);
        hq.dialog(hq.dialogs.loggingIn);
        return false;
    },
    
    logout: function() {
        e.app.members.logout(hq.loggedOut);
    },
    
    loggedOut: function(err, obj) {
        hq.member = null;
        hq.panels = {};
        $('#hq-panels').html('').hide();
        hq.toolbar();
        hq.dialog(hq.dialogs.loggedOut);
    },
    
    toolbar: function() {
        if(!hq.member)
            return $('#hq-toolbar').hide().html('');
        var t = $('#hq-toolbar');
        t.html('');
        [
            {text:'Welcome, '},
            {text: hq.member.name, click: hq.account},
            {text:'Logout', click: hq.logout}
        ].forEach(function(x) {
            if(typeof x.click === 'function')
                $('<span>').appendTo(t).text(x.text).addClass('clickable').click(x.click);
            else
                $('<span>').appendTo(t).text(x.text);
        });
        t.fadeIn();
    },

    account: function() {
        hq.dialog(hq.dialogs.accountSettings);
    }
};