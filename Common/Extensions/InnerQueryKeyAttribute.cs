using System;
using System.Reflection;

namespace BookStore.Common.Extensions
{
    public class InnerQueryKeyAttribute : Attribute
    {
        public string InnerQueryKey { get; protected set; }

        public InnerQueryKeyAttribute(string value)
        {
            this.InnerQueryKey = value;
        }
    }
}