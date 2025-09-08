# Railway-Supabase Latency Test

This is a simple Express.js app to test latency between Railway and Supabase when both are deployed in Singapore.

## Quick Setup

1. **Deploy to Railway:**
   ```bash
   # Create new Railway project
   railway login
   railway new
   railway link
   ```

2. **Set Environment Variables in Railway:**
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Deploy:**
   ```bash
   railway up
   ```

## Test Endpoints

Once deployed, visit these endpoints:

- `GET /` - Basic health check
- `GET /test/connection` - Simple connection test
- `GET /test/comprehensive` - Multiple query types
- `GET /test/stress/20` - Run 20 rapid queries
- `GET /test/network` - Network information

## Expected Results

- **Excellent**: < 5ms average
- **Good**: 5-15ms average  
- **Acceptable**: 15-30ms average
- **Poor**: > 30ms average

## Example Response

```json
{
  "success": true,
  "results": [
    { "test": "Simple SELECT", "latency": "3ms" },
    { "test": "COUNT query", "latency": "4ms" },
    { "test": "Auth session check", "latency": "2ms" }
  ],
  "averageLatency": "3ms",
  "railwayRegion": "singapore"
}
```

## Notes

- Make sure both Railway and Supabase are in Singapore region
- Test multiple times throughout the day
- The `users` table is assumed to exist - adjust queries if needed