/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// NEED TO CHANGE THIS FOR PRODUCTION
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const fetchAssignment = async (courseId: any, token:any) => {
  const data = await fetch(
    `https://ec2-3-87-255-160.compute-1.amazonaws.com/learn/api/public/v1/courses/${courseId}/gradebook/columns`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const result = await data.json();
  console.log("inside fetch assignments", result);
  return result;
};

const getActualToken = async (code:any) => {
  try {
    console.log("inactualToken", code);
    const requestBody = new URLSearchParams();
    requestBody.append("grant_type", "authorization_code");
    console.log("this is requestbody", requestBody);

    const response = await fetch(
      `https://ec2-3-87-255-160.compute-1.amazonaws.com/learn/api/public/v1/oauth2/token?code=${code}&redirect_uri=https://edusync-e6e17.web.app/dashboard`,
      // `https://ec2-3-87-255-160.compute-1.amazonaws.com/learn/api/public/v1/oauth2/token?code=${code}&redirect_uri=http://localhost:5173/dashboard`,
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
    console.log("anotherdata", data);
    return data;
  } catch (error) {
    console.log("inside get actual token error:", error);
  }
};

export const getConnection = onRequest({cors: true}, async (req, res)=>{
  try {
    // console.log("clientid", process.env.CLIENT_ID);
    const response = await fetch(
      `https://ec2-3-87-255-160.compute-1.amazonaws.com/learn/api/public/v1/oauth2/authorizationcode?redirect_uri=https://edusync-e6e17.web.app/dashboard&response_type=code&client_id=${process.env.CLIENT_ID}&scope=read&state=DC1067EE-63B9-40FE-A0AD-B9AC069BF4B0`,
      // `https://ec2-3-87-255-160.compute-1.amazonaws.com/learn/api/public/v1/oauth2/authorizationcode?redirect_uri=http://localhost:5173/dashboard&response_type=code&client_id=${process.env.CLIENT_ID}&scope=read&state=DC1067EE-63B9-40FE-A0AD-B9AC069BF4B0`,
      {
        headers: {
          "Content-Type": "form/urlencoded",
        },
      }
    );
    const htmlContent = await response.text();
    console.log(htmlContent);
    res.send(htmlContent);
  } catch (error) {
    console.error("Error:", error);
  }
});

export const getToken = onRequest({cors: true}, async (req, res)=>{
  console.log("hello why isnt this running");
  const code = req.query.code;
  console.log("this is the req.quey.code reuslt", code);
  const token = await getActualToken(code);
  res.send(token);
});

export const getCourses = onRequest({cors: true}, async (req, res)=> {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const userid = req.headers["userid"];
  console.log("Inside get courses", token, userid);

  const classes = await fetch(
    `https://ec2-3-87-255-160.compute-1.amazonaws.com/learn/api/public/v1/users/uuid:${userid}/courses`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await classes.json();

  console.log("classes", data.results);

  const finalList = data.results ? await Promise.all(
    data.results.map(async (elem:any) => {
      console.log(elem.courseId);
      const idk = await fetch(
        `https://ec2-3-87-255-160.compute-1.amazonaws.com/learn/api/public/v1/courses/${elem.courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const assignments = await fetchAssignment(elem.courseId, token);
      console.log("assignments", assignments);
      const moreData = await idk.json();
      console.log("inside moreData", moreData);
      return {
        courseName: moreData.name,
        assignments: assignments.results.slice(2),
      };
    })
  ): [];
  console.log(finalList);
  res.send(finalList);
});
