using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using TextToolPoc.DataAccess;

namespace TextToolPoc.Controllers
{
    public class RulesController : ApiController
    {
        private TextToolContainer db = new TextToolContainer();

        // GET: api/Rules
        public IQueryable<DataAccess.Rule> GetRules()
        {
            return db.Rules;
        }

        // GET: api/Rules/5
        [ResponseType(typeof(DataAccess.Rule))]
        public IHttpActionResult GetRule(int id)
        {
            DataAccess.Rule rule = db.Rules.Find(id);
            if (rule == null)
            {
                return NotFound();
            }

            return Ok(rule);
        }

        // PUT: api/Rules/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutRule(int id, DataAccess.Rule rule)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != rule.Id)
            {
                return BadRequest();
            }

            db.Entry(rule).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RuleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Rules
        [ResponseType(typeof(DataAccess.Rule))]
        public IHttpActionResult PostRule(DataAccess.Rule rule)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Rules.Add(rule);
            db.SaveChanges();

            return Ok(new { success = true, id = rule.Id });
        }

        // DELETE: api/Rules/5
        [ResponseType(typeof(DataAccess.Rule))]
        public IHttpActionResult DeleteRule(int id)
        {
            DataAccess.Rule rule = db.Rules.Find(id);
            if (rule == null)
            {
                return NotFound();
            }

            db.Rules.Remove(rule);
            db.SaveChanges();

            return Ok(rule);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool RuleExists(int id)
        {
            return db.Rules.Count(e => e.Id == id) > 0;
        }
    }
}