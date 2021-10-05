using BookStore.Common.Extensions;

namespace BookStore.Common.Enums
{
    public enum BookSearchCriteria
    {
        [QueryKey("q")]
        [InnerQueryKey("isbn")]
        ISBN = 1,

        [QueryKey("q")]
        [InnerQueryKey("inTitle")]
        Title = 2,

        [QueryKey("q")]
        FullText = 3

        // https://developers.google.com/books/docs/v1/using#st_params

        /* q - Search for volumes that contain this text string. There are special keywords you can specify in the search terms to search in particular fields, such as:
intitle: Returns results where the text following this keyword is found in the title.
inauthor: Returns results where the text following this keyword is found in the author.
inpublisher: Returns results where the text following this keyword is found in the publisher.
subject: Returns results where the text following this keyword is listed in the category list of the volume.
isbn: Returns results where the text following this keyword is the ISBN number.
lccn: Returns results where the text following this keyword is the Library of Congress Control Number.
oclc: Returns results where the text following this keyword is the Online Computer Library Center number. */
    }
}