Ext.define('Com.PerkinElmer.Service.Gaea.Views.ResultGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'result-grid',

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
                if (fieldMatch.Article.Id === Com.PerkinElmer.Service.Gaea.Globals.SelectedArticle.Id) {
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
});