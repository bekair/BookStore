using EntityStore.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace EntityStore.Entity
{
    [Table("Book")]
    public class Book : EntityBase
    {
        public Book() : base()
        {
            this.BookAuthors = new HashSet<BookAuthor>();
        }

        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        public virtual IEnumerable<BookAuthor> BookAuthors { get; set; }
        public virtual BookDetail BookDetail { get; set; }
    }
}
