Ext.define('Com.PerkinElmer.Service.Gaea.Stores.RuleStore', {
    extend: 'Ext.data.Store',
    xtype: 'rule-store',

    autoLoad: true,

    proxy: {
        type: 'ajax',
        url: '/api/Rules',
        reader: {
            type: 'json'
        }
    }
});