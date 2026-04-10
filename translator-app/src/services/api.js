
export const translateText = async (text, source, target) => {
  const res = await fetch("https://google-translate113.p.rapidapi.com/api/v1/translator/text", {
    method: "POST",
    headers: {
       "content-type": "application/json",
        "X-RapidAPI-Key": "61aa1d533bmshad2bb6ef55f81f2p1898bfjsn6e084d6f8779",
        "X-RapidAPI-Host": "google-translate113.p.rapidapi.com",
    },
    body: JSON.stringify({
        from: source,   // ✅ correct key
        to: target,     // ✅ correct key
        text: text,     // ✅ correct key
      }),
    }
  );

  if (!res.ok) {
    throw new Error("API Error");
  }

  const data = await res.json();

  // ⚠️ IMPORTANT: response structure differs per API
  // You MUST check your API response in console

  console.log(data);

  // Example common formats:
  return data.trans || "";
};
