Ext.define('Com.PerkinElmer.Service.Gaea.Views.RuleGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'rule-grid',

    title: '规则列表',

    store: Ext.create({
        xtype: 'rule-store'
    }),

    columns: [
        { text: '编号', dataIndex: 'Id', width: 30 },
        { text: '规则名称', dataIndex: 'RuleName', width: 80 },
        { text: '规则类型', dataIndex: 'RuleType', width: 80 },
        { text: '规则', dataIndex: 'Content', width: 200 },
        {
            text: '删除',
            align: 'center',
            cell: {
                xtype: 'widgetcell',
                widget: {
                    xtype: 'button',
                    ui: 'action',
                    text: '删除',
                    handler: function () {
                        var rule = this.up().up().getRecord().getData();

                        Ext.getCmp('ruleDialog').setMasked({ xtype: 'loadmask', message: 'loading...' });

                        Ext.Ajax.request({
                            url: '/api/Rules/' + rule.Id,
                            method: 'DELETE',
                            success: function () {
                                Ext.getCmp('ruleGrid').getStore().reload();
                                Ext.getCmp('ruleDialog').setMasked(null);
                            }
                        });
                    }
                }
            }
        }
    ],
    height: '100%',
    layout: 'fit'
});