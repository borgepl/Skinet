using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class SocialUserDto
    {
    public string provider { get; set; }
    public string id { get; set; }
    
    public string email { get; set; }
    public string name { get; set; }
    public string photoUrl { get; set; }
    public string firstName { get; set; }
    public string lastName { get; set; }
    public string authToken { get; set; }
    public string idToken { get; set; }
    public string authorizationCode { get; set; }
    public string response { get; set; }
   
    }
}