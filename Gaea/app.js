/*
 * This call registers your application to be launched when the browser is ready.
 */
Ext.application({
    name: 'Gaea',

    requires: [
        'Ext.panel.Resizer',
        'Ext.Toolbar',
        'Ext.grid.plugin.CellEditing',
        'Ext.layout.HBox',
        // Stores
        'Com.PerkinElmer.Service.Gaea.Stores.RuleStore',
        'Com.PerkinElmer.Service.Gaea.Stores.TemplateStore',
        'Com.PerkinElmer.Service.Gaea.Stores.CaseStore',
        // Views
        'Com.PerkinElmer.Service.Gaea.Views.DetailsGrid',
        'Com.PerkinElmer.Service.Gaea.Views.ResultGrid',
        'Com.PerkinElmer.Service.Gaea.Views.RuleGrid',

        'Com.PerkinElmer.Service.Gaea.Views.CaseForm',
        'Com.PerkinElmer.Service.Gaea.Views.AppPanel',
        'Com.PerkinElmer.Service.Gaea.Views.AppToolbar'
    ],

    launch: function () {

        Ext.ns('Com.PerkinElmer.Service.Gaea.Globals');

        Com.PerkinElmer.Service.Gaea.Globals.SelectedArticle = { Id: 0 };

        Ext.Viewport.add({
            id: 'mainPanel',
            xtype: 'panel',
            items: [
                { xtype: 'app-toolbar' },
                { xtype: 'app-panel' }
            ]
        });
    }
});
