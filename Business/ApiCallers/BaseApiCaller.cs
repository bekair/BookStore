using System;
using System.Collections.Specialized;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using BookStore.Common.Enums;

namespace BookStore.Business.ApiCallers
{
    public class BaseApiCaller : IBaseApiCaller
    {
        private static HttpClient client = new HttpClient();
        protected string ApiKey;
        protected string ApiUrl;

        public virtual Uri BuildUri(NameValueCollection query)
        {
            throw new NotImplementedException();
        }

        private async Task<HttpResponseMessage> Call(HttpRequestMessage requestMessage)
        {
            return await client.SendAsync(requestMessage);
        }

        protected async Task<HttpResponseMessage> Fetch(Uri uri)
        {
            var requestMessage = new HttpRequestMessage();

            requestMessage.RequestUri = uri;
            requestMessage.Method = HttpMethod.Get;
            requestMessage.Content.Headers.ContentType.MediaType = "application/json; charset=utf-8";

            return await this.Call(requestMessage);
        }

        protected async Task<HttpResponseMessage> Fetch(NameValueCollection collection)
        {
            var requestMessage = new HttpRequestMessage();

            requestMessage.RequestUri = BuildUri(collection);
            requestMessage.Method = HttpMethod.Get;

            return await this.Call(requestMessage);
        }

        protected async Task<HttpResponseMessage> Post(Uri uri, HttpContent content)
        {
            var requestMessage = new HttpRequestMessage();

            requestMessage.RequestUri = uri;
            requestMessage.Content = content;
            requestMessage.Method = HttpMethod.Post;

            return await this.Call(requestMessage);
        }
    }
}