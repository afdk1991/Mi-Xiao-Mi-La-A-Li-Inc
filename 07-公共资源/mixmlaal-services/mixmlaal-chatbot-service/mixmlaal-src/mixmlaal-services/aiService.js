const { ChatCompletionsClient } = require('azure-ai-inference');
const { SystemMessage, UserMessage } = require('azure-ai-inference/models');
const { AzureKeyCredential } = require('azure-core-credentials');

const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

let client = null;

const getClient = () => {
  if (!client) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN environment variable is not set');
    }
    client = new ChatCompletionsClient({
      endpoint,
      credential: new AzureKeyCredential(token),
    });
  }
  return client;
};

const aiService = {
  async chat(question, systemPrompt = 'You are a helpful assistant.') {
    try {
      const chatClient = getClient();

      const response = await chatClient.complete({
        messages: [
          new SystemMessage(systemPrompt),
          new UserMessage(question),
        ],
        temperature: 1.0,
        top_p: 1.0,
        model,
      });

      return {
        success: true,
        answer: response.choices[0].message.content,
        usage: response.usage ? {
          prompt_tokens: response.usage.prompt_tokens,
          completion_tokens: response.usage.completion_tokens,
          total_tokens: response.usage.total_tokens,
        } : null,
      };
    } catch (error) {
      console.error('AI Service Error:', error.message);
      return {
        success: false,
        error: error.message,
        answer: null,
      };
    }
  },

  async chatWithContext(question, context, systemPrompt) {
    const fullSystemPrompt = systemPrompt || `You are a helpful customer service assistant. Use the following context to answer questions.\n\nContext:\n${context}`;

    return this.chat(question, fullSystemPrompt);
  },
};

module.exports = aiService;
