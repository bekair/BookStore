using System;
using System.Reflection;

namespace BookStore.Common.Extensions
{
    public static class EnumExtensions
    {
        public static string GetQueryKey(this Enum value)
        {
            // Get the type
            Type type = value.GetType();

            // Get fieldinfo for this type
            FieldInfo fieldInfo = type.GetField(value.ToString());

            // Get the queryvalue attributes
            QueryKeyAttribute[] attributes = fieldInfo.GetCustomAttributes(
                typeof(QueryKeyAttribute), false) as QueryKeyAttribute[];

            // Return the first if there was a match.
            return attributes.Length > 0 ? attributes[0].QueryKey : null;
        }

        public static string GetInnerQueryKey(this Enum value)
        {
            // Get the type
            Type type = value.GetType();

            // Get fieldinfo for this type
            FieldInfo fieldInfo = type.GetField(value.ToString());

            // Get the queryvalue attributes
            InnerQueryKeyAttribute[] attributes = fieldInfo.GetCustomAttributes(
                typeof(InnerQueryKeyAttribute), false) as InnerQueryKeyAttribute[];

            // Return the first if there was a match.
            return attributes.Length > 0 ? attributes[0].InnerQueryKey : null;
        }


    }
}