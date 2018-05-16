Ext.define('Com.PerkinElmer.Service.Gaea.Views.AppToolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'app-toolbar',

    requires: [
        'Com.PerkinElmer.Service.Gaea.Views.RuleForm',
        'Com.PerkinElmer.Service.Gaea.Views.RuleGrid',
        'Com.PerkinElmer.Service.Gaea.Views.TemplateForm',
        'Com.PerkinElmer.Service.Gaea.Views.TemplateGrid'
    ],

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
                        items: [{ id: 'ruleForm', xtype: 'rule-form' }]
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
                        items: [{ id: 'templateGrid', xtype: 'template-grid' }]
                    }, {
                        title: '模板项目',
                        flex: true,
                        items: [{ id: 'templateForm', xtype: 'template-form' }]
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