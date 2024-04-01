import {onRequest} from "firebase-functions/v2/https";

// NEED TO CHANGE THIS FOR PRODUCTION
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// HELPER FUNCTION TO RETRIEVE BB ASSIGNMENT DATA
const fetchBBAssignment = async (courseId: any, token:any) => {
  const data = await fetch(
    `${process.env.BB_BASE_URL}/learn/api/public/v1/courses/${courseId}/gradebook/columns`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const result = await data.json();
  return result;
};

// HELPER FUNCTION TO RETRIEVE TOKEN FOR BB
const getBBActualToken = async (code:any) => {
  try {
    const requestBody = new URLSearchParams();
    requestBody.append("grant_type", "authorization_code");
    // Check if production or development
    let redirectUri = "http://localhost:5173/dashboard";
    const environment = process.env.ENVIRONMENT || "development";
    if (environment === "production") {
      redirectUri = "https://edusync-e6e17.web.app/dashboard";
    }
    const response = await fetch(
      `${process.env.BB_BASE_URL}/learn/api/public/v1/oauth2/token?code=${code}&redirect_uri=${redirectUri}`,
      {
        body: requestBody,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization":
            "Basic " +
            Buffer.from(
              process.env.CLIENT_ID + ":" + process.env.SECRET
            ).toString("base64"),
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Inside Get Actual Token Function Error:", error);
  }
};

// ESTABLISHES CONNECTION WITH BB
export const getConnection = onRequest({cors: true}, async (req, res)=>{
  try {
    const clientId = process.env.CLIENT_ID;
    let redirectUri = "http://localhost:5173/dashboard";
    const environment = process.env.ENVIRONMENT || "development";
    if (environment === "production") {
      redirectUri = "https://edusync-e6e17.web.app/dashboard";
    }

    const response = await fetch(
      `${process.env.BB_BASE_URL}/learn/api/public/v1/oauth2/authorizationcode?redirect_uri=${redirectUri}&response_type=code&client_id=${clientId}&scope=read&state=DC1067EE-63B9-40FE-A0AD-B9AC069BF4B0`,
      {
        headers: {
          "Content-Type": "form/urlencoded",
        },
      }
    );
    const htmlContent = await response.text();
    res.send(htmlContent);
  } catch (error) {
    console.error("Inside Get Connection Error:", error);
  }
});

// GETS TOKEN FOR BB
export const getToken = onRequest({cors: true}, async (req, res)=>{
  const code = req.query.code;
  const token = await getBBActualToken(code);
  res.send(token);
});

// GETS COURSES FOR BB
export const getCourses = onRequest({cors: true}, async (req, res)=> {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const userid = req.headers["userid"];

  const classes = await fetch(
    `${process.env.BB_BASE_URL}/learn/api/public/v1/users/uuid:${userid}/courses`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await classes.json();

  const finalList = data.results ? await Promise.all(
    data.results.map(async (elem:any) => {
      const idk = await fetch(
        `${process.env.BB_BASE_URL}/learn/api/public/v1/courses/${elem.courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const assignments = await fetchBBAssignment(elem.courseId, token);
      const moreData = await idk.json();
      return {
        courseName: moreData.name,
        assignments: assignments.results.slice(2),
      };
    })
  ): [];
  res.send(finalList);
});

// ESTABLISHES CONNECTION AND RETRIEVE DATA FROM GRADESCOPE
export const getGSConnection = onRequest({cors: true}, async (req, res)=>{
  const {username, password} = req.body;
  try {
    const result = await fetch("https://gs-flask-api-obsoqcj6da-uc.a.run.app/assignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const data = await result.json();
    res.send(data);
  } catch (error) {
    console.error("Inside getGSConnection Function Error:", error);
  }
});

/////////////////
export const exchangeToken = onRequest(async (request, response) => {
  const code: any = request.query.code;
  const redirect_uri = "http://127.0.0.1:5001/edusync-e6e17/us-central1/exchangeToken"; // Replace with your actual redirect URI

  // Prepare the URL and the data for the POST request to Google's OAuth2 endpoint
  const tokenExchangeUrl = 'https://oauth2.googleapis.com/token';
  const params = new URLSearchParams();
  params.append('code', code);
  params.append('client_id', '642660880490-eofmqqgspbhulqckmbbplt9q97j69af6.apps.googleusercontent.com'); // Replace with your actual client ID
  params.append('client_secret', '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'); // Replace with your actual client secret
  params.append('redirect_uri', redirect_uri);
  params.append('grant_type', 'authorization_code');

  try {
    // Await the response from the fetch request
    const fetchResponse = await fetch(tokenExchangeUrl, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log("IDK")

    // Check if the fetch request was not successful
    if (!fetchResponse.ok) {
      console.log("THIS IS WRONG")
      throw new Error(`Server responded with ${fetchResponse.status}`);
    }

    console.log("DOES IT GO HERE")

    // Await the parsing of the JSON response
    const data = await fetchResponse.json();

    // Respond to the client with the access token
    // Optionally, you can handle storing the tokens securely or further processing here
    // response.send({ accessToken: data.access_token });
    const frontendRedirectUri = `http://localhost:5173/piazza?accessToken=${data.access_token}`;
    response.redirect(frontendRedirectUri);
  } catch (error:any) {
    // Log and respond with the error
    console.error('Failed to exchange token:', error);
    response.status(500).send(error.toString());
  }
});