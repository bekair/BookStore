using EntityStore.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace EntityStore.Entity
{
    [Table("BookAuthor")]
    public class BookAuthor : EntityBase
    {
        public BookAuthor() : base() { }

        [ForeignKey("Book")]
        [Required]
        public int BookId { get; set; }
        public Book Book { get; set; }

        [ForeignKey("Author")]
        [Required]
        public int AuthorId { get; set; }
        public Author Author { get; set; }
    }
}
