using Common.Enums;
using EntityStore.Base;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EntityStore.Entity
{
    [Table("BookDetail")]
    public class BookDetail : EntityBase
    {
        public BookDetail() : base() { }

        [ForeignKey("Book")]
        [Required]
        public int BookId { get; set; }
        public Book Book { get; set; }

        public long? ISBN { get; set; }

        public byte[] CoverPhoto { get; set; }

        public string PublisherName { get; set; }

        [Required]
        public BookCategory? BookCategory { get; set; }

        public int? PageCount { get; set; }

        public DateTime? PublishDate { get; set; }

        public Language? BookLanguage { get; set; }

    }
}
