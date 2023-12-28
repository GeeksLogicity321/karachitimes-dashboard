import axios from "axios"



const baseUrl= "https://karachi-today-e1e41b662536.herokuapp.com"
// const baseUrl= "http://localhost:9000/api/v1/"


export const Action  = axios.create({    
    baseURL: baseUrl,  
    "Content-Type": "application/json",
    headers: {
        
        Authorization:`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTIxYmRjZjUxMGY2NzUyMzAwMDMwMjIiLCJpYXQiOjE2OTY3MTAxMzV9.zeSIIZ8SfuHEI1py-X_sdNN9kZQ_zmDY7rPxGCiXYYg`        

        
    }
  });
  
//   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTI0OTRhZWY0ZjBmNzhhODhmZjg3N2MiLCJpYXQiOjE2OTgyNTk1MzJ9.6McvkRptSj_bNzStP85dUh2cs9VVlBhfMVf4vEDyXiY