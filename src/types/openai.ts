export interface OpenAIOptions {
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export interface OpenAIProxyResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
