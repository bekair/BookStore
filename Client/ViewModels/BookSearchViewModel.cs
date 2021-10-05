using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Client.ViewModels
{
    public class BookSearchViewModel
    {

        public BookSearchViewModel(JToken volumeInfo)
        {
            this.Title = volumeInfo["title"] == null ? "" : (string)volumeInfo["title"];
            this.Authors = volumeInfo["authors"] == null ? null : ((JArray)volumeInfo["authors"]).ToObject<ICollection<string>>();
            this.Publisher = volumeInfo["publisher"] == null ? "" : (string)volumeInfo["publisher"];
            this.PublishedDate = volumeInfo["publishedDate"] == null ? "" : (string)volumeInfo["publishedDate"];
            this.Description = volumeInfo["description"] == null ? "" : (string)volumeInfo["description"];
            this.Categories = volumeInfo["categories"] == null ? null : ((JArray)volumeInfo["categories"]).ToObject<ICollection<string>>();
        }

        public string Title { get; set; }
        public ICollection<string> Authors { get; set; }
        public string Publisher { get; set; }
        public string PublishedDate { get; set; }
        public string Description { get; set; }
        public int PageCount { get; set; }
        public ICollection<string> Categories { get; set; }
    }
}
