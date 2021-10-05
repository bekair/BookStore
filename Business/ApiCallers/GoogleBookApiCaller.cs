using System;
using System.Collections.Specialized;
using System.Linq;
using System.Net.Http;
using System.Web;
using BookStore.Common.Enums;
using BookStore.Common.Extensions;
using Microsoft.Extensions.Configuration;

namespace BookStore.Business.ApiCallers
{
    public sealed class GoogleBookApiCaller : BaseApiCaller, IGoogleBookApiCaller
    {
        public GoogleBookApiCaller()
        {

        }

        public GoogleBookApiCaller(IConfiguration configuration)
        {
            ApiKey = configuration.GetSection("GoogleBookApi:Key").Value;
            ApiUrl = configuration.GetSection("GoogleBookApi:Url").Value;
        }

        public string GetBook(BookSearchCriteria criteria, string searchKey)
        {
            var collection = new NameValueCollection();
            string modifiedSearchKey = searchKey;

            var queryKey = criteria.GetQueryKey();
            var innerQueryKey = criteria.GetInnerQueryKey();

            if (!string.IsNullOrEmpty(innerQueryKey))
            {
                modifiedSearchKey = string.Join(":", innerQueryKey.ToString(), searchKey);
            }

            collection.Add(queryKey, modifiedSearchKey);

            return this.Fetch(collection).Result.Content.ReadAsStringAsync().Result;
        }

        public override Uri BuildUri(NameValueCollection queryCollection)
        {
            var collection = HttpUtility.ParseQueryString(string.Empty);

            foreach (var key in queryCollection.Cast<string>().Where(key => !string.IsNullOrEmpty(queryCollection[key])))
            {
                collection[key] = queryCollection[key];
            }

            // Add Api Key
            collection.Add("key", ApiKey);

            UriBuilder builder = new UriBuilder(string.Concat(ApiUrl, "?")) { Query = collection.ToString() };
            return builder.Uri;
        }
    }
}