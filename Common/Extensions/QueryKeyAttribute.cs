using System;
using System.Reflection;

namespace BookStore.Common.Extensions
{
    public class QueryKeyAttribute : Attribute
    {
        public string QueryKey { get; protected set; }

        public QueryKeyAttribute(string value)
        {
            this.QueryKey = value;
        }
    }
}