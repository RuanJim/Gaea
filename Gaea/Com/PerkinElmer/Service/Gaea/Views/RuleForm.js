Ext.define('Com.PerkinElmer.Service.Gaea.Views.RuleForm', {
    extend: 'Ext.form.Panel',
    xtype: 'rule-form',

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
});
