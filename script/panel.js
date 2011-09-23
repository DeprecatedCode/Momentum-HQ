hq.panels = {};
    
hq.panel = function(name, template, func) {
    this.name = name;
    this.template = template;
    this.render();
    if(func)
        this['show'+func]();
};
    
hq.panelExists = function (name) {
    return typeof hq.panel[name] !== 'undefined';
};
    
hq.showPanel = function(name, func) {
    func = func || 'Only';
    if(!hq.panelExists(name)) {
        
        // Load template
        hq.load('templates/'+name+'.json', function(template) {
            hq.createPanel(name, template, func);
        }, null, 'Loading template '+name+'...');
    } else {
        hq.panels[name]['show'+func]();
    }
};

// Extend the panel
hq.panel.prototype = {
    showOnly: function() {
        $('#hq-panels > div').hide();
        this.div.fadeIn();
    },
    render: function() {
        if(typeof this.div === 'undefined')
            this.div = $('<div>').hide().addClass('panel').appendTo($('#hq-panels'));
        else
            this.div.hide().html('');
        
        if(typeof this.template !== 'object' || typeof this.template.elements === 'undefined') {
            this.template = {elements: []};
            this.template.elements.push({
                type: 'error',
                text: '<b>Render Error</b> &middot; Invalid template format'
            });
        }
        this.renderElement(this.div, this.template);
        
    },
    renderElement: function(parent, el) {
        
        if(typeof el !== 'object')
            el = {type: 'error', text: '<b>Render Error</b> &middot; Invalid element format'};
            
        switch(el.type) {
            case 'error':
                var x = $('<div>').addClass('error');
                x.html(el.text);
                break;
            default:
                var x = $('<div>');
        }
        
        // Stop on empty elements
        if(typeof x !== 'object')
            return;
        
        // Append the element
        parent.append(x);
        
        // Loop through children
        if(typeof el.elements !== 'undefined' && el.elements.length > 0) {
            
            var that = this;
            el.elements.forEach(function(el) {
                that.renderElement(x, el);
            });
        }
    }
};

hq.createPanel = function(name, template, func) {
    hq.panels[name] = new hq.panel(name, template, func);
}