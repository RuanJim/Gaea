Ext.define('Com.PerkinElmer.Service.Gaea.Views.DetailsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'details-grid',

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