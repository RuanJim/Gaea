Ext.define('Com.PerkinElmer.Service.Gaea.Views.AppToolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'app-toolbar',

    docked: 'top',
    items: [{
        xtype: 'button',
        text: '添加病历',
        iconCls: 'openFile',
        handler: function () {
            if (!Ext.getCmp('filename').getValue()) {
                Ext.Msg.alert("文件名不能为空。");
                return;
            };


            Ext.Ajax.request({
                url: "/api/Articles",
                method: "POST",
                jsonData: {
                    FileName: Ext.getCmp('filename').getValue(),
                    OriginalContent: Ext.getCmp('caseText').getValue()
                },
                success: function () {
                    Ext.Msg.alert("添加完成");
                }
            });
        }
    }, {
        xtype: 'button',
        text: '选择病历',
        iconCls: 'chooseFile',
        handler: function () {
            var dialog = Ext.create({
                xtype: 'dialog',
                title: '选择病历',

                closable: true,
                width: 600,
                height: 400,

                items: [{
                    id: 'caseList',
                    xtype: 'list',
                    fullscreen: true,
                    itemTpl: "{FileName}",
                    padding: 5,
                    store: Ext.create({ xtype: 'case-store' })
                }],
                buttons: [{
                    xtype: 'button',
                    text: '选择',
                    handler: function () {
                        var article = Ext.getCmp("caseList").getSelection().getData();

                        Com.PerkinElmer.Service.Gaea.Globals.SelectedArticle = article;

                        Ext.getCmp("filename").setValue(article.FileName);
                        Ext.getCmp("caseText").setValue(article.OriginalContent);

                        dialog.destroy();
                    }
                }]
            });

            dialog.show();
        }
    }, {
        xtype: 'button',
        text: '规则设置',
        iconCls: 'setting',
        handler: function () {
            var dialog = Ext.create({
                xtype: 'dialog',
                title: '规则设置',

                maximizable: true,
                closable: true,
                width: 1100,
                height: 800,
                layout: "fit",
                items: [{
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
                        items: [{ id: 'ruleGrid', xtype: 'rule-grid' }]
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
                }]
            });

            dialog.show();
        }
    }, {
        xtype: 'button',
        text: '模板设置',
        iconCls: 'templateSettings',
        handler: function () {
            var dialog = Ext.create({
                xtype: 'dialog',
                title: '模板设置',

                maximizable: true,
                closable: true,
                width: 1100,
                height: 800,
                layout: "fit",
                items: [{
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
                }]
            });

            Ext.StoreManager.get("templateStore").load();

            dialog.show();
        }
    }, {
        xtype: 'button',
        text: '查看结果',
        iconCls: 'view',
        handler: function () {
            Ext.Ajax.request({
                url: '/api/getMatch',
                method: 'POST',
                jsonData: {
                    TemplateId: 1,
                    ArticleId: Com.PerkinElmer.Service.Gaea.Globals.SelectedArticle.Id
                },
                success: function (response) {
                    Ext.getCmp("resultGrid").setStore(Ext.create('Ext.data.Store', {
                        fields: [
                            'Id',
                            'FieldName',
                            {
                                name: 'ExpectedValue',
                                type: 'string',
                                mapping: function (data) {
                                    var exp = "";

                                    Ext.Array.each(data.FieldExpecteds, function (fieldExpected) {
                                        if (fieldExpected.Article.Id === Com.PerkinElmer.Service.Gaea.Globals.SelectedArticle.Id) {
                                            exp = fieldExpected.Value;
                                        }
                                    });

                                    return exp;
                                }
                            }
                        ],
                        data: Ext.decode(response.responseText)
                    }));
                }
            });
        }
    }, {
        xtype: 'button',
        text: '执行匹配',
        iconCls: 'run',
        handler: function () {
            Ext.getCmp('mainPanel').setMasked({ xtype: 'loadmask', message: 'loading...' });

            Ext.Ajax.request({
                url: '/api/run',
                method: 'POST',
                jsonData: {
                    TemplateId: 1,
                    ArticleId: Com.PerkinElmer.Service.Gaea.Globals.SelectedArticle.Id
                },
                success: function (response) {
                    Ext.getCmp('mainPanel').setMasked(null);
                }
            });
        }
    }]

});