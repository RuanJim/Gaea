using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Http;
using TextToolPoc.DataAccess;

namespace TextToolPoc.Controllers
{
    public class CustomController : ApiController
    {
        private TextToolContainer db = new TextToolContainer();

        [HttpGet]
        [Route("api/Version")]
        public IHttpActionResult Version()
        {
            return Ok(this.GetType().Assembly.GetName().Version.ToString());
        }

        [HttpPost]
        [Route("api/ChangeExpectValue")]
        public IHttpActionResult ChangeExpectValue(dynamic args)
        {
            int fieldId = args.FieldId;
            int articleId = args.ArticleId;
            string val = args.ExpectedValue;

            TemplateField templateField = db.TemplateFields
                .Include("FieldExpecteds.Article")
                .First(f => f.Id == fieldId);

            FieldExpected fieldExpected = templateField.FieldExpecteds.FirstOrDefault(fe => fe.Value == val);

            if (fieldExpected == null)
            {
                fieldExpected = new FieldExpected
                {
                    Article = db.Articles.First(a => a.Id == articleId),
                    Value = val
                };

                templateField.FieldExpecteds.Add(fieldExpected);
            }
            else
            {
                fieldExpected.Value = val;
            }

            db.SaveChanges();

            return Ok();
        }

        [HttpPost]
        [Route("api/GetTemplateFieldList")]
        public IHttpActionResult GetTemplateFieldList(dynamic args)
        {
            return Ok(db.TemplateFields.Any(tf => tf.FieldExpecteds.Any(fe => fe.Article.Id == 2)));
        }

        [HttpPost]
        [Route("api/getMatch")]
        public IHttpActionResult GetMatch(dynamic args)
        {
            int templateId = args.TemplateId,
                articleId = args.ArticleId;

            Article article = db.Articles.First(a => a.Id == articleId);

            Template template = db.Templates.Include("TemplateFields").First(t => t.Id == templateId);

            /// TODO:
            List<TemplateField> fields = db.TemplateFields
                .Include("FieldExpecteds")
                .Include("FieldMatches")
                .AsEnumerable()
                .Where(tf => template.TemplateFields.Contains(tf))
                .ToList();

            return Ok(fields);
        }

        [HttpPost]
        [Route("api/run")]
        public IHttpActionResult Run(dynamic args)
        {
            int templateId = args.TemplateId,
                articleId = args.ArticleId;

            List<FieldMatch> matches = db.FieldMatches
                .Include("Article")
                .Where(fm => fm.Article.Id == articleId).ToList();

            db.FieldMatches.RemoveRange(matches);
            db.SaveChanges();

            Article article = db.Articles.First(a => a.Id == articleId);
            Template template = db.Templates
                .Include("TemplateFields.FieldExpecteds.Article")
                .First(t => t.Id == templateId);


            List<Rule> rules = db.Rules.ToList();

            foreach (TemplateField field in template.TemplateFields)
            {
                string expectedValue = field.FieldExpecteds.First(fe => fe.Article.Id == articleId).Value;

                foreach (Rule rule in rules)
                {
                    string expression = rule.Content.Replace("[TAG]", field.FieldName);

                    Regex regex = new Regex(expression);

                    if (regex.IsMatch(article.OriginalContent))
                    {
                        FieldMatch fm = new FieldMatch();

                        fm.Article = article;
                        fm.Rule = rule;

                        Match match = regex.Match(article.OriginalContent);

                        try
                        {
                            fm.MatchText = match.Groups[1].Captures[0].Value;
                            fm.MatchScore = Convert.ToInt32(utils.LevenshteinDistance.Instance.LevenshteinDistancePercent(expectedValue, fm.MatchText) * 100);

                            field.FieldMatches.Add(fm);
                        }
                        catch
                        {
                            //    fm.MatchText = string.Empty;
                            //    fm.MatchScore = 0;
                        }
                    }
                    //else
                    //{
                    //    fm.MatchText = string.Empty;
                    //    fm.MatchScore = 0;
                    //}

                }
            }

            article.Runned = true;
            db.SaveChanges();

            return Ok();
        }

        [HttpPost]
        [Route("api/SaveTemplateField")]
        public IHttpActionResult SaveTemplateField(dynamic args)
        {
            int articleId = args.ArticleId;

            string fieldName = args.Name;

            TemplateField field = db.TemplateFields.FirstOrDefault(tf => tf.FieldName == fieldName);

            if (field == null)
            {
                field = new TemplateField
                {
                    FieldName = fieldName
                };

                db.Templates.First().TemplateFields.Add(field);
            }

            field.FieldExpecteds.Add(new FieldExpected {
                Article = db.Articles.First(a => a.Id == articleId),
                Value = args.ExpectedValue
            });

            db.SaveChanges();

            return Ok();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
