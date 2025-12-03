# Claude API Setup Guide

This guide will help you set up the Anthropic Claude API for the HomeRun Coach AI application.

## Prerequisites

1. **Anthropic Account**: Sign up at [console.anthropic.com](https://console.anthropic.com/)
2. **API Key**: Create an API key in your Anthropic dashboard

## Setup Steps

### 1. Create Environment File

Create a `.env` file in the root of the project:

```bash
# Copy this template
cp .env.example .env
```

Or create `.env` manually with:

```env
# Required: Your Anthropic API key
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...

# Optional: Choose Claude model (default: claude-3-5-sonnet-20241022)
# For Sonnet 4/4.5, use the exact model names from Anthropic's documentation
VITE_CLAUDE_MODEL=claude-3-5-sonnet-20241022
```

### 2. Get Your API Key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Navigate to API Keys section
3. Create a new API key
4. Copy the key (starts with `sk-ant-api03-...`)
5. Paste it into your `.env` file

### 3. Choose Your Model

The app supports Claude Sonnet models. Check the [Anthropic Models Documentation](https://docs.anthropic.com/claude/docs/models-overview) for the latest model names.

**Current recommended models:**
- `claude-3-5-sonnet-20241022` - Sonnet 3.5 (default, widely available)
- `claude-sonnet-4-20250514` - Sonnet 4 (verify exact name)
- `claude-sonnet-4-5-20250514` - Sonnet 4.5 (verify exact name)

**Note:** Model names may change. Always verify the exact model identifier in Anthropic's documentation.

### 4. Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to a module chat (Story, Solution, or Success)

3. Send a message - if the API is configured correctly, you'll get real Claude responses

4. If the API key is missing or invalid, the app will fall back to mock responses

## Troubleshooting

### API Key Not Working

- ✅ Verify the key starts with `sk-ant-api03-`
- ✅ Check for extra spaces or quotes in `.env`
- ✅ Restart the dev server after changing `.env`
- ✅ Verify the key is active in Anthropic console

### Model Not Found

- ✅ Check the exact model name in Anthropic's documentation
- ✅ Verify the model is available in your API plan
- ✅ Try using `claude-3-5-sonnet-20241022` as a fallback

### Rate Limits

- ✅ Check your Anthropic account limits
- ✅ The app will show an error message if rate limited
- ✅ Consider upgrading your Anthropic plan if needed

### Fallback to Mock Responses

If you see mock responses instead of Claude:
- ✅ Check browser console for errors
- ✅ Verify `VITE_ANTHROPIC_API_KEY` is set correctly
- ✅ Ensure `.env` file is in the project root
- ✅ Restart the dev server

## Security Notes

⚠️ **Important:** Never commit your `.env` file to git. It's already in `.gitignore`.

For production deployments:
- **Vercel**: Add `VITE_ANTHROPIC_API_KEY` in Project Settings → Environment Variables
- **GitHub Pages**: Consider using a backend proxy (GitHub Pages doesn't support server-side env vars)
- **Other platforms**: Set environment variables according to their documentation

## Cost Considerations

Claude API usage is billed per token. Monitor your usage in the Anthropic console:
- Input tokens: ~$3-15 per million tokens (varies by model)
- Output tokens: ~$15-75 per million tokens (varies by model)

The app uses:
- System prompt: ~500-1000 tokens per conversation
- User messages: Variable
- AI responses: Variable (max 2048 tokens per response)

## Next Steps

Once set up, the AI coaching will:
- Use your coaching system prompt
- Maintain conversation context
- Follow the Story/Solution/Success framework
- Provide natural, conversational responses

Enjoy your AI-powered coaching experience! 🚀

