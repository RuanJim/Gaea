Ext.define('Com.PerkinElmer.Service.Gaea.Views.AppPanel', {
    extend: 'Ext.Panel',
    xtype: 'app-panel',

    layout: 'vbox',
    items: [
        {
            xtype: 'case-form'
        }, {
            xtype: 'panel',
            docked: 'right',
            layout: 'hbox',
            width: '50%',
            items: [{
                id: 'resultGrid',
                xtype: 'result-grid'
            }, {
                id: 'detailGrid',
                xtype: 'details-grid'
            }]
        }
    ]
});
