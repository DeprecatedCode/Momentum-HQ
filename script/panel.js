hq.panels = {};
    
hq.panel = function(name, template, func) {
    this.name = name;
    this.template = template;
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
        hq.dialog({action: 'Showing the panel ' + this.name});
    }
};

hq.createPanel = function(name, template, func) {
    hq.panels[name] = new hq.panel(name, template, func);
}