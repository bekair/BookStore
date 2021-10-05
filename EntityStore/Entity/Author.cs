using EntityStore.Base;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EntityStore.Entity
{
    [Table("Author")]
    public class Author : EntityBase
    {
        public Author() : base()
        {
            this.BookAuthors = new HashSet<BookAuthor>();
        }

        [Column("Name")]
        [Required]
        public string AuthorName { get; set; }

        public int? Age { get; set; }

        public virtual IEnumerable<BookAuthor> BookAuthors { get; set; }
    }
}