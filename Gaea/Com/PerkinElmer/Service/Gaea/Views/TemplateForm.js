Ext.define('Com.PerkinElmer.Service.Gaea.Views.TemplateForm', {
    extend: 'Ext.form.Panel',
    xtype: 'template-form',

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
});

