using EntityStore.Base;
using System;

namespace DataAccess.Result
{
    public class TransactionResult<T> where T : class
    {
        public bool? IsSuccessfull { get; set; }
        public T ResultObject { get; set; }
        public string ErrorMessage { get; set; }

        public TransactionResult()
        { }

        public TransactionResult(bool isSuccessfull, T resultObject, string errorMessage)
        {
            IsSuccessfull = isSuccessfull;
            ResultObject = resultObject;
            ErrorMessage = errorMessage;
        }
    }
}
