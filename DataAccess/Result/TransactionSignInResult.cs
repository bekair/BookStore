using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.Result
{
    public class TransactionSignInResult<T> : TransactionResult<T> where T : class
    {
        public SignInResult SignInResult { get; set; }

        public TransactionSignInResult(bool isSuccessfull, T resultObject, SignInResult signInResult, string errorMessage)
            : base(isSuccessfull, resultObject, errorMessage)
        {
            SignInResult = signInResult;
        }
    }
}
