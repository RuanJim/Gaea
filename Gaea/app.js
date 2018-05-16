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

        'Com.PerkinElmer.Service.Gaea.Views.CaseForm',
        'Com.PerkinElmer.Service.Gaea.Views.AppPanel',
        'Com.PerkinElmer.Service.Gaea.Views.AppToolbar'
    ],

    launch: function () {

        Ext.ns('Com.PerkinElmer.Service.Gaea.Globals');

        Com.PerkinElmer.Service.Gaea.Globals.SelectedArticle = { Id: 0 };

        var ruleSettings = {
            id: 'ruleDialog',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            defaultType: 'panel',

            items: [{
                docked: 'left',
                width: 600,
                height: '100%',
                resizable: {
                    split: true,
                    edges: 'east'
                },
                items: [{
                    id: 'ruleGrid',
                    xtype: 'grid',
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
                }]
            }, {
                title: '规则内容',
                flex: true,
                items: [{
                    id: 'ruleForm',
                    xtype: 'formpanel',
                    bodyPadding: 20,
                    autoSize: true,
                    waitMsg: 'loading...',
                    items: [{
                        xtype: 'textfield',
                        allowBlank: false,
                        required: true,
                        label: '规则名称',
                        name: 'RuleName',
                        placeholder: '规则名称'
                    }, {
                        xtype: 'selectfield',
                        allowBlank: false,
                        required: true,
                        label: '规则类型',
                        name: 'RuleType',
                        placeholder: '规则类型',
                        options: [{
                            text: "正则表达式",
                            value: "RegExp"
                        }]
                    }, {
                        xtype: 'textareafield',
                        allowBlank: false,
                        required: true,
                        label: '规则',
                        name: 'Content',
                        placeholder: '规则'
                    }],
                    buttons: {
                        submit: {
                            text: "保存",
                            handler: function () {
                                var rForm = Ext.getCmp("ruleForm");

                                if (rForm.isValid()) {
                                    rForm.submit({
                                        url: '/api/Rules',
                                        method: 'POST',
                                        success: function (form, action) {
                                            Ext.getCmp('ruleGrid').getStore().reload();
                                            Ext.getCmp("ruleForm").reset();
                                        }
                                    });
                                }
                            }
                        }
                    }
                }]
            }]
        };

        var templateSettings = {
            id: 'templateDialog',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            defaultType: 'panel',

            items: [{
                docked: 'left',
                width: 600,
                height: '100%',
                resizable: {
                    split: true,
                    edges: 'east'
                },
                items: [{
                    id: 'templateGrid',
                    xtype: 'grid',
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
                }]
            }, {
                title: '模板项目',
                flex: true,
                items: [{
                    id: 'templateForm',
                    xtype: 'formpanel',
                    bodyPadding: 20,
                    autoSize: true,
                    waitMsg: 'loading...',
                    items: [{
                        xtype: 'textfield',
                        allowBlank: false,
                        required: true,
                        label: '项目名称',
                        name: 'Name',
                        placeholder: '项目名称'
                    }, {
                        xtype: 'hiddenfield',
                        name: 'ArticleId'
                    }, {
                        xtype: 'textfield',
                        allowBlank: false,
                        required: true,
                        label: '期望值',
                        name: 'ExpectedValue',
                        placeholder: '期望值'
                    }],
                    buttons: {
                        submit: {
                            text: "保存",
                            handler: function () {
                                var rForm = Ext.getCmp("templateForm");

                                rForm.setValues({ ArticleId: Com.PerkinElmer.Service.Gaea.Globals.SelectedArticle.Id });

                                if (rForm.isValid()) {
                                    Ext.Ajax.request({
                                        url: "/api/SaveTemplateField",
                                        method: "POST",
                                        jsonData: rForm.getValues(),
                                        success: function () {
                                            Ext.getCmp('templateGrid').getStore().reload();
                                            Ext.getCmp("templateForm").reset();
                                        }
                                    });
                                }
                            }
                        }
                    }
                }]
            }]
        };

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
