Ext.define('Com.PerkinElmer.Service.Gaea.Stores.TemplateStore', {
    extend: 'Ext.data.Store',
    xtype: 'template-store',


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
                    if (fieldExpected.Article.Id === Com.PerkinElmer.Service.Gaea.Globals.SelectedArticle.Id) {
                        exp = fieldExpected.Value;
                    }
                });

                return exp;
            }
        }
    ]

});