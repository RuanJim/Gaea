Ext.define('Com.PerkinElmer.Service.Gaea.Views.TemplateGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'template-grid',

    title: '模板项目列表',

    store: Ext.create({
        id: "templateStore",
        xtype: 'template-store'
    }),

    columns: [
        { text: '编号', dataIndex: 'Id', width: 30 },
        { text: '模板名称', dataIndex: 'FieldName', width: 80 },
        { text: '期望匹配结果', dataIndex: 'ExpectedValue', width: 80 },
        {
            text: '修改期望值',
            align: 'center',
            cell: {
                xtype: 'widgetcell',
                widget: {
                    xtype: 'button',
                    ui: 'action',
                    text: '修改期望值',
                    handler: function () {
                        var field = this.up().up().getRecord().getData();
                        Ext.Msg.prompt("请输入新的期望值。", '', function (bid, value) {
                            Ext.getCmp('templateDialog').setMasked({ xtype: 'loadmask', message: 'loading...' });

                            Ext.Ajax.request({
                                url: '/api/ChangeExpectValue',
                                method: 'POST',
                                jsonData: {
                                    FieldId: field.Id,
                                    ArticleId: Com.PerkinElmer.Service.Gaea.Globals.SelectedArticle.Id,
                                    ExpectedValue: value
                                },
                                success: function () {
                                    Ext.getCmp('templateGrid').getStore().reload();
                                    Ext.getCmp('templateDialog').setMasked(null);
                                }
                            });
                        });

                    }
                }
            }
        }
    ],
    height: '100%',
    layout: 'fit'
});

