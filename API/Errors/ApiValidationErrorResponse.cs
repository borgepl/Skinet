namespace API.Errors
{
    public class ApiValidationErrorResponse
    {
        public ApiValidationErrorResponse()
        {
        }

        public int StatusCode { get; set; } = 400;
        public string Message { get; set; } = "A Bad request, you have made!";
        public IEnumerable<string> Errors { get; set; }

    }
}