# question_URLHash

# Problem
-  Marketing department often using long URLs with UTM tracking
-  These URLS are copied to various locations like sheets and Docs
-  When copied, there is a chance of URLs getting ruined by formatters.

# Proposed Solution
- Make a URL hashing System, when url provided, it should hash the string and provide a unique url
- These URLs should be Used only once. As often loading the url with UTM tracking leads to wrong analytics.

# Proposed Design

![alt text](https://apexglam.b-cdn.net/Screenshot%202021-11-28%20at%2011.45.06%20AM.png)

# Used Tech Stack
- Nodejs
- MongoDB

# Endpoints Created
- /hashUrl : 
  - method: POST
  - body Params: url
  - response Params: hashurl
- /:id :
  - method: GET
  - Url Params: hashcode(:id in this case)
  - response Params: either redirect (or) 204 response (no content)
 
# Deployments
 - Nodejs App is deployed in Digital Ocean
 - End point : https://question-url-hash-ilfn3.ondigitalocean.app/
 - MongoDB is deployed on mongodb.com free instance
 - frontend html files are deployed on CDN (on bunnycdn.com)
 - frontend url: https://apexglam.b-cdn.net/index.html
