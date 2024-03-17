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
        `https://ec2-54-90-80-111.compute-1.amazonaws.com/learn/api/public/v1/courses/${elem.courseId}`,
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
