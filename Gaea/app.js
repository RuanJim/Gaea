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
        'Com.PerkinElmer.Service.Gaea.Stores.RuleStore'
    ],

    launch: function () {

        Ext.ns('Com.PerkinElmer.Service.Gaea.Globals');

        Com.PerkinElmer.Service.Gaea.Globals.SelectedArticle = { Id: 0 };

        let selectedArticle = Com.PerkinElmer.Service.Gaea.Globals.SelectedArticle;

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

                    store: Ext.create("Com.PerkinElmer.Service.Gaea.Stores.RuleStore"),

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

        var templateStore = Ext.create('Ext.data.Store', {
            id: "templateStore",
            proxy: {
                type: 'ajax',
                url: '/api/TemplateFields',
                reader: {
                    type: 'json'
                }
            },
            fields: [
                'Id', 'Name', {
                    name: 'ExpectedValue',
                    type: 'string',
                    mapping: function (data) {
                        var exp = "";

                        Ext.Array.each(data.FieldExpecteds, function (fieldExpected) {
                            if (fieldExpected.Article.Id === selectedArticle.Id) {
                                exp = fieldExpected.Value;
                            }
                        });

                        return exp;
                    }
                }
            ]
        });

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

                    store: templateStore,

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
                                                    ArticleId: selectedArticle.Id,
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

                                rForm.setValues({ ArticleId: selectedArticle.Id });

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

        var toolbar = {
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                xtype: 'button',
                text: '添加病历',
                iconCls: 'openFile',
                handler: function () {
                    if (!Ext.getCmp('filename').getValue()) {
                        Ext.Msg.alert("文件名不能为空。");
                        return ;
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

                    Ext.Ajax.request({
                        url: '/api/Articles',
                        success: function (response) {
                            var articles = Ext.decode(response.responseText);

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
                                    store: {
                                        xtype: "store",
                                        columns: ['FileName', 'OriginalContent'],
                                        data: articles
                                    }
                                }],
                                buttons: [{
                                    xtype: 'button',
                                    text: '选择',
                                    handler: function () {
                                        var article = Ext.getCmp("caseList").getSelection().getData();

                                        selectedArticle = article;

                                        Ext.getCmp("filename").setValue(article.FileName);
                                        Ext.getCmp("caseText").setValue(article.OriginalContent);

                                        dialog.destroy();
                                    }
                                }]
                            });

                            dialog.show();
                        }
                    });

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
                        items: [ruleSettings]
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
                        items: [templateSettings]
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
                            ArticleId: selectedArticle.Id
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
                                                if (fieldExpected.Article.Id === selectedArticle.Id) {
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
                            ArticleId: selectedArticle.Id
                        },
                        success: function (response) {
                            Ext.getCmp('mainPanel').setMasked(null);
                        }
                    });
                }
            }]
        };

        var formPanel = {
            xtype: 'formpanel',
            docked: 'left',
            width: '50%',
            title: '病历',
            padding: 10,
            items: [{
                id: 'filename',
                label: '文件名',
                required: true,
                xtype: 'textfield'
            }, {
                id: 'caseText',
                label: '病历',
                xtype: 'textareafield',
                height: '700',
                required: true,
                value: ''
            }]
        };

        var resultGrid = {
            id: 'resultGrid',
            xtype: 'grid',
            title: '匹配结果',
            docked: 'top',
            height: 400,

            columns: [
                { text: '编号', dataIndex: 'Id', width: 100 },
                { text: '名称', dataIndex: 'FieldName', width: 200 },
                { text: '期望值', dataIndex: 'ExpectedValue', width: 200 }
            ],

            listeners: {
                select: function (src, selectedItems, option) {
                    var field = selectedItems[0].getData();

                    var filteredData = [];

                    Ext.each(field.FieldMatches, function (fieldMatch) {
                        if (fieldMatch.Article.Id === selectedArticle.Id) {
                            filteredData.push(fieldMatch);
                        }
                    });

                    Ext.getCmp("detailGrid").setStore(Ext.create("Ext.data.Store", {
                        fields: [
                            'Id',
                            'MatchText',
                            'MatchScore',
                            {
                                name: 'RuleContent',
                                type: 'string',
                                mapping: function (data) {
                                    return data.Rule.Content;
                                }
                            },
                            {
                                name: 'RuleName',
                                type: 'string',
                                mapping: function (data) {
                                    return data.Rule.RuleName;
                                }
                            }
                        ],
                        data: filteredData
                    }));
                }
            }
        };

        var detailGrid = Ext.create("Ext.grid.Grid", {
            id: 'detailGrid',
            xtype: 'grid',
            title: '规则评分',
            docked: 'top',
            height: 400,

            plugins: {
                cellediting: true
            },

            selectable: {
                rows: false,
                cells: true
            },

            listeners: {
                edit: function () {
                    debugger;
                }
            },

            columns: [
                { text: '编号', dataIndex: 'Id', width: 40 },
                { text: '规则', dataIndex: 'RuleName', width: 80 },
                { text: '规则', dataIndex: 'RuleContent', width: 200 },
                { text: '匹配文本', dataIndex: 'MatchText', width: 100 },
                { text: '匹配得分', editable: true, dataIndex: 'MatchScore', width: 100 }
            ]
        });

        var panel = {
            xtype: 'panel',
            layout: 'vbox',
            items: [
                formPanel,
                {
                    xtype: 'panel',
                    docked: 'right',
                    layout: 'hbox',
                    width: '50%',
                    items: [resultGrid, detailGrid]
                }
            ]
        };

        Ext.Viewport.add({
            id: 'mainPanel',
            xtype: 'panel',
            items: [
                toolbar,
                panel
            ]
        });
    }


});


