Ext.define('Com.PerkinElmer.Service.TextTool.Views.TemplatePanel', {
    extend: 'Ext.Container',
    xtype: 'template-panel',

    requires: [
        'Ext.layout.VBox'
    ],


    layout: {
        type: 'vbox',
        pack: 'center',
        align: 'stretch'
    },

    defaults: {
        bodyPadding: 10
    },

    items: [{
        layout: {
            type: 'hbox',
            pack: 'center',
            align: 'stretch'
        },
        items: [{
            xtype: 'grid',
            shadow: true,
            docked: 'left',
            margin: 5,
            width: 'calc(50% - 10px)',
            title: '模板列表'

        }, {
            xtype: 'panel',
            shadow: 'true',
            docked: 'right',
            title: '编辑模板',
            width: 'calc(50% - 10px)',
            height: 700,
            margin: 5,
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
                    label: '项目名称',
                    name: 'Name',
                    placeholder: '项目名称'
                }, {
                    xtype: 'textareafield',
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