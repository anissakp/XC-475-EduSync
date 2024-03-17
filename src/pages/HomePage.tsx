import { useState, useEffect } from "react";

export default function HomePage() {
  const [htmlContent, setHtmlContent] = useState("");

  // ESTABLISHED CONNECTION WITH BB
  const handleConnectCLK = async () => {
    const bbConnectionURL = import.meta.env.VITE_BB_CONNECTION_URL;
    const result = await fetch(bbConnectionURL);
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
