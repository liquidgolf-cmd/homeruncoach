# Debugging Claude API Issues

## Check if API is Being Used

1. **Open Browser Console** (F12 or Cmd+Option+I)
2. **Look for these log messages:**
   - 🔑 API Key Check: Shows if API key is detected
   - 🤖 Calling Claude API: Shows when API is called
   - ✅ Claude API response received: Shows successful API call
   - ❌ Claude API error: Shows if there's an error

## Common Issues

### 1. Dev Server Not Restarted
**Problem:** Environment variables are only loaded when the dev server starts.

**Solution:**
```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. API Key Format Issue
**Problem:** API key might have extra characters or wrong format.

**Check:**
- API key should start with: `sk-ant-api03-`
- Should be a long string (50+ characters)
- No spaces or quotes around it in .env file

**Fix:**
```env
# Correct format:
VITE_ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE

# Wrong formats:
VITE_ANTHROPIC_API_KEY="sk-ant-api03-..."  # No quotes
VITE_ANTHROPIC_API_KEY= sk-ant-api03-...   # No spaces
```

### 3. Model Name Issue
**Problem:** Model name might not be recognized.

**Check in console:**
- Look for "Model error" messages
- Verify model name matches: `claude-sonnet-4-5`

### 4. Network/API Errors
**Check browser console for:**
- 401 errors = Invalid API key
- 429 errors = Rate limit exceeded
- Network errors = Connection issues

## Testing Steps

1. **Check .env file:**
   ```bash
   cat .env | grep VITE_ANTHROPIC_API_KEY
   ```

2. **Verify API key format:**
   - Should start with `sk-ant-api03-`
   - Should be in the .env file without quotes

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

4. **Test in browser:**
   - Open browser console
   - Go to a module chat
   - Send a message
   - Check console logs for API calls

## Still Not Working?

1. Check browser console for errors
2. Verify API key is correct in Anthropic console
3. Make sure you're using the latest code (pulled from git)
4. Try clearing browser cache and restarting dev server

