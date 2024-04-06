import {onRequest} from "firebase-functions/v2/https";
import * as admin from 'firebase-admin';
import { google } from 'googleapis';
admin.initializeApp();


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
      `${process.env.BB_BASE_URL}/learn/api/public/v1/oauth2/authorizationcode?redirect_uri=${redirectUri}&response_type=code&client_id=${clientId}&scope=offline read&state=DC1067EE-63B9-40FE-A0AD-B9AC069BF4B0`,
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

export const getTokenByRefresh = onRequest({cors: true}, async (req, res)=>{
  const refreshToken = req.query.refreshToken;

  let redirectUri = "http://localhost:5173/dashboard";
  const environment = process.env.ENVIRONMENT || "development";
  if (environment === "production") {
    redirectUri = "https://edusync-e6e17.web.app/dashboard";
  }

  const response = await fetch(`${process.env.BB_BASE_URL}/learn/api/public/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + Buffer.from(process.env.CLIENT_ID + ":" + process.env.SECRET).toString("base64"),
    },
    body: `grant_type=refresh_token&refresh_token=${refreshToken}&redirect_uri=${encodeURIComponent(redirectUri)}`,
  });
  const data = await response.json();
  res.send(data);
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
        courseID: elem.courseId,
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

// PIAZZA TOKEN EXCHANGE
export const exchangeToken = onRequest(async (req, res) => {
  const code:any = req.query.code;

  // Retrieve userID
  const encodedState:any = req.query.state;
  const decodedState = decodeURIComponent(encodedState);
  const stateObject = JSON.parse(decodedState);
  const userID = stateObject.userID;

  const redirect_uri = "http://127.0.0.1:5001/edusync-e6e17/us-central1/exchangeToken"; 

  // Body for fetch request
  const body:any = {
    code: code,
    client_id: process.env.GOOGLE_CLIENT_ID, 
    client_secret: process.env.GOOGLE_SECRET, 
    redirect_uri: redirect_uri,
    grant_type: 'authorization_code'
  };

  try {
    // Request token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: new URLSearchParams(body),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await tokenResponse.json();
    console.log("DATAAAA", data)

    const expirationSeconds = data.expires_in; // This is typically in seconds
    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + expirationSeconds);

    // Store access token into firestore database for given user
    const userDocRef = admin.firestore().doc(`users/${userID}`);
    await userDocRef.update({
        gmailApiAccessToken: data.access_token,
        gmailApiAccessTokenExpiration: expirationDate,
        gmailApiRefreshToken: data.refresh_token
    });

    // Send repsonse back to client
    const frontendRedirectUri = `http://localhost:5173/piazza`;
    res.redirect(frontendRedirectUri);

  } catch (error:any) {
    // Log and respond with the error
    console.error('Failed to exchange token:', error);
    res.status(500).send(error.toString());
  }
});

export const getPiazzaAnnouncements = onRequest({cors: true}, async (req, res)=>{
  console.log("INSIDE GET PIAZZA")
  // const userID = "ejPKKytR8MV6Hu2g3cyncOmP6Q33"
  const userID:any = req.query.userID;
  console.log("GETPIAZZA", userID)
  const userDocRef = admin.firestore().doc(`users/${userID}`);
  const docSnapshot = await userDocRef.get();
  const userData:any = docSnapshot.data();
  console.log("USERDATAAAAA", userData)
  const gmailAccessToken = userData.gmailApiAccessToken

  const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({access_token: gmailAccessToken});

      const gmail = google.gmail({version: 'v1', auth: oauth2Client});
      const listResponse = await gmail.users.messages.list({
        userId: 'me',
        // maxResults: 500,
      });
      
      const messages = listResponse.data.messages || [];

      console.log("MESSAGES", messages)
      const searchString = 'no-reply@piazza.com';

      const filteredMessagePromises = messages.map(async (message:any) => {
        const indMessage:any = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        });
        const headers:any = indMessage.data.payload.headers;
        const fromHeader = headers.find((header:any) => header.name === "From");
        if (fromHeader && fromHeader.value.includes(searchString)) {
          return indMessage.data;
        }
        return null;
      });

      Promise.all(filteredMessagePromises).then(filteredMessages => {
        const validMessages = filteredMessages.filter(msg => msg !== null);
        console.log("VALIDMESSAGE", validMessages)
        res.status(200).send(validMessages);
      });
})

export const getPiazzaNewAccessToken = onRequest({cors: true}, async (req, res)=>{
      const userID:any = req.query.userID;
      const userDocRef = admin.firestore().doc(`users/${userID}`);
      const docSnapshot = await userDocRef.get();
      const userData:any = docSnapshot.data();
      const body:any = {
        client_id: process.env.GOOGLE_CLIENT_ID, 
        client_secret: process.env.GOOGLE_SECRET, 
        refresh_token: userData.gmailApiRefreshToken, // Use the stored refresh token
        grant_type: 'refresh_token' // Specify the grant type for refreshing
      };

      // Make the request to Google's OAuth2 token endpoint
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        body: new URLSearchParams(body),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      const data = await response.json(); // Parse the JSON response
      const expirationSeconds = data.expires_in; // The new expiration time in seconds
      const expirationDate = new Date();
      expirationDate.setSeconds(expirationDate.getSeconds() + expirationSeconds);

      // Update Firestore with the new access token and expiration
      await userDocRef.update({
          gmailApiAccessToken: data.access_token,
          gmailApiAccessTokenExpiration: expirationDate
          // Note: The refresh token usually remains the same and doesn't need to be updated unless you've received a new one
      });

      res.status(200).send({hello: "hello"}); // Or handle the new token as needed
});

export const getCourseAnnouncements = onRequest({cors: true}, async (req, res)=>{
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const courseId = req.headers["courseid"];

  try {
    const data = await fetch(
      `${process.env.BB_BASE_URL}/learn/api/public/v1/courses/${courseId}//announcements`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await data.json();
    res.send(result);
  } catch (error) {
    console.error("Inside getCourseAnnouncement Function Error:", error);
  }
});
