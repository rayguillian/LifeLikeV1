import { DEEPSEEK_CONFIG, validateConfig } from '../deepseekConfig';

export class DeepseekAgent {
  constructor(agentType, systemPrompt) {
    this.agentType = agentType;
    this.systemPrompt = systemPrompt;
  }

  async callAPI(prompt, responseSchema = null) {
    validateConfig();
    
    const messages = [{
      role: 'system',
      content: this.systemPrompt
    }, {
      role: 'user',
      content: prompt
    }];

    if (responseSchema) {
      messages.push({
        role: 'system',
        content: `Respond with valid JSON matching this schema: ${JSON.stringify(responseSchema)}`
      });
    }

    const response = await fetch(`${DEEPSEEK_CONFIG.BASE_URL}${DEEPSEEK_CONFIG.ENDPOINTS.CHAT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`${this.agentType} API error: ${response.statusText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }
}