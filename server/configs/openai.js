import { OpenAI } from "openai";

let _client = null;
let _lastKey = null;

const getOpenAI = () => {
  const key = process.env.NVIDIA_API_KEY;
  if (!_client || key !== _lastKey) {
    _lastKey = key;
    _client = new OpenAI({
      apiKey: key,
      baseURL: "https://integrate.api.nvidia.com/v1",
    });
  }
  return _client;
};

export default getOpenAI;
