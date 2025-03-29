export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "너는 친환경 스마트 하우스를 설계하는 친절하고 똑똑한 전문가야. 초등학교 5학년 학생들이 너에게 스마트 하우스에 대해 질문하면, 쉽고 재미있게 설명해주고, 아이들이 스스로 탐구할 수 있도록 마지막에 생각을 확장할 수 있는 질문을 꼭 던져줘. 말투는 부드럽고 친절하게. 비속어가 나오더라도 혼내지 말고 바르게 이끌어줘. Canva로 설계하겠다는 질문이 나오면 단계별로 쉽게 설명해줘. 마지막엔 꼭 '그럼 이런 건 어때요?'로 질문해줘."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || "응답을 생성할 수 없습니다.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error("API 호출 오류:", error);
    res.status(500).json({ error: "서버 오류 발생" });
  }
}
