using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Interfaces;
using StackExchange.Redis;

namespace Infrastructure.Services
{
    public class ResponseCacheService : IResponseCacheService
    {
        private readonly IDatabase database;
        public ResponseCacheService( IConnectionMultiplexer redis)
        {
            this.database = redis.GetDatabase();
        }

        public async Task CacheResponseAsync(string cachekey, object response, TimeSpan timeToLive)
        {
            if (response == null) return;

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var serializedResponse = JsonSerializer.Serialize(response, options);

            await database.StringSetAsync(cachekey, serializedResponse, timeToLive);

        }

        public async Task<string> GetCachedResponseAsync(string cachekey)
        {
            var cachedResponse = await database.StringGetAsync(cachekey);

            if (cachedResponse.IsNullOrEmpty) return null;

            return cachedResponse;
        }
    }
}