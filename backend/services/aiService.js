const { OpenAI } = require('openai');

const analyzeResume = async (resumeText) => {
  const useGroq = !!process.env.GROQ_API_KEY;
  const apiKey = useGroq ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('No API key configured. Please set GROQ_API_KEY or OPENAI_API_KEY');
  }

  const openai = new OpenAI({
    apiKey,
    baseURL: useGroq ? 'https://api.groq.com/openai/v1' : undefined,
  });

  const model = useGroq 
    ? (process.env.GROQ_MODEL || 'llama3-70b-8192') 
    : (process.env.OPENAI_MODEL || 'gpt-3.5-turbo');

  const truncatedText = resumeText.substring(0, 6000);

  const prompt = `You are an expert ATS resume analyzer and career coach.
First, classify the provided text. Is it a resume/CV? 
A resume/CV typically contains sections like contact info, experience, education, or skills. Even if poorly formatted, if its purpose is to apply for a job, treat it as a valid resume.

If you are ABSOLUTELY CERTAIN the text is NOT a resume (for example, it is a university assignment, a syllabus, or a random article), return ONLY this JSON:
{
  "isResume": false,
  "reason": "Explain in 1 sentence what the document actually is."
}

If it IS a valid resume, perform a thorough, real analysis of the resume text. You MUST generate REAL feedback, scores, strengths, and weaknesses based on the actual content of the resume.
Respond ONLY with a valid JSON object in the exact format below. DO NOT output any other text or markdown. DO NOT output fake data, analyze the actual resume.
{
  "isResume": true,
  "atsScore": 0,
  "detectedSkills": [],
  "missingKeywords": [],
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "formattingFeedback": [],
  "recommendedRoles": [],
  "sectionScores": {
    "contactInfo": 0,
    "summary": 0,
    "experience": 0,
    "education": 0,
    "skills": 0,
    "formatting": 0
  },
  "overallFeedback": ""
}

Resume:
"""
${truncatedText}
"""`;

  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
  });

  let rawJson = response.choices[0].message.content.trim();
  
  const firstBrace = rawJson.indexOf('{');
  const lastBrace = rawJson.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
    rawJson = rawJson.substring(firstBrace, lastBrace + 1);
  }

  try {
    const parsedData = JSON.parse(rawJson);
    
    // Clamp atsScore
    parsedData.atsScore = Math.max(0, Math.min(100, parsedData.atsScore || 0));
    
    return { data: parsedData, modelUsed: model };
  } catch (error) {
    throw new Error('Failed to parse AI response as valid JSON');
  }
};

module.exports = {
  analyzeResume,
};
