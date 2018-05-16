Ext.define('Com.PerkinElmer.Service.Gaea.Views.CaseForm', {
    extend: 'Ext.form.Panel',
    xtype: 'case-form',

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
});