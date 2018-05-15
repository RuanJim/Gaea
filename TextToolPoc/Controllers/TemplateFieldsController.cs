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
    public class TemplateFieldsController : ApiController
    {
        private TextToolContainer db = new TextToolContainer();

        // GET: api/TemplateFields
        public IQueryable<TemplateField> GetTemplateFields()
        {
            return db.TemplateFields;
        }

        // GET: api/TemplateFields/5
        [ResponseType(typeof(TemplateField))]
        public IHttpActionResult GetTemplateField(int id)
        {
            TemplateField templateField = db.TemplateFields.Find(id);
            if (templateField == null)
            {
                return NotFound();
            }

            return Ok(templateField);
        }

        // PUT: api/TemplateFields/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTemplateField(int id, TemplateField templateField)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != templateField.Id)
            {
                return BadRequest();
            }

            db.Entry(templateField).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TemplateFieldExists(id))
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

        // POST: api/TemplateFields
        [ResponseType(typeof(TemplateField))]
        public IHttpActionResult PostTemplateField(TemplateField templateField)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.TemplateFields.Add(templateField);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = templateField.Id }, templateField);
        }

        // DELETE: api/TemplateFields/5
        [ResponseType(typeof(TemplateField))]
        public IHttpActionResult DeleteTemplateField(int id)
        {
            TemplateField templateField = db.TemplateFields.Include("FieldExpecteds").Include("FieldMatches").First(f => f.Id == id);

            if (templateField == null)
            {
                return NotFound();
            }

            db.FieldExpecteds.RemoveRange(templateField.FieldExpecteds);
            db.FieldMatches.RemoveRange(templateField.FieldMatches);

            db.TemplateFields.Remove(templateField);
            db.SaveChanges();

            return Ok(templateField);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TemplateFieldExists(int id)
        {
            return db.TemplateFields.Count(e => e.Id == id) > 0;
        }
    }
}