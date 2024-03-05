# EduSync

Our current product is at this link: https://edusync-e6e17.web.app/ 

## Connecting to Blackboard 
Currently, we are using the data from an AWS instance that we have created, which only has one user. The credentials to log in and connect to Blackboard are below: <br/>
Username: xysugino <br/>
Password: xysugino 

## Changing the environments 
We haven't yet configured the prod environment and the dev environment hence it is possible that after connecting to Blackboard it's redirected to a local environment (local host). To fix this in the functions/src/index.ts file in lines 65 and 38 (around) there is a link that includes a commented link right above. Uncomment the commented lines and comment the uncommented lines. This being lines 37 and 64 should be uncommented and lines 65 and 38 should be uncommented. Then in terminal, cd into the functions folder and run the command firebase deploy --only functions. When prompted with "Would you like to proceed with deletion? Selecting no will continue the rest of the deployment" select no. After that command has completed then it should work and you will be redirected to the hosted environment after connecting to Blackboard. 

## Team members <br/>
Zai Sugino <br/>
Anissa Patel <br/>
Samantha Pang <br/>
Shaimaa Sabbagh <br/>
Emily Doherty 
