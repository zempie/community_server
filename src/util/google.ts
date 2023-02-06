const { TranslationServiceClient } = require('@google-cloud/translate');

const GOOGLE_APPLICATION_CREDENTIALS = '../../firebase-authentication-zempie-dev.json'


const projectId = 'zempie-dev'
const location = 'global';

export async function detectLanguage(text: string ) {
  const translationClient = new TranslationServiceClient();

    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      content: text,
    };

    const [response] = await translationClient.detectLanguage(request);

    return response.languages;

}
