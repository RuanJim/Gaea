Ext.define('Com.PerkinElmer.Service.Gaea.Stores.CaseStore', {
    extend: 'Ext.data.Store',
    xtype: 'case-store',

    autoLoad: true,

    columns: ['FileName', 'OriginalContent'],

    proxy: {
        type: 'ajax',
        url: '/api/Articles',
        reader: {
            type: 'json'
        }
    }
});