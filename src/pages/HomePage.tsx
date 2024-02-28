import { useState, useEffect } from "react";

export default function HomePage() {
  const [htmlContent, setHtmlContent] = useState("");

  // ESTABLISHED CONNECTION WITH BB
  const handleConnectCLK = async () => {
    const result = await fetch("http://127.0.0.1:5001/edusync-e6e17/us-central1/getConnection");
    const htmlContent = await result.text();
    console.log("html", htmlContent);
    setHtmlContent(htmlContent);
  };

  return (
    <>
      <div>
        {(htmlContent && (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        )) || (
          <>
            <h1>Home</h1>
            <button onClick={handleConnectCLK}>Connect with Blackboard</button>
          </>
        )}
      </div>
    </>
  );
}
