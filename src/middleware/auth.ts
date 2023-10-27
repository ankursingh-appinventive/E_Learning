import jwt from "jsonwebtoken";
import { createClient } from 'redis';
import { Session } from "../models/session.Model";
import { User } from "../models/user.Model";
import { constants } from "../constants";
import dotenv from "dotenv";
dotenv.config();
const SEC_KEY = process.env.SEC_KEY;

declare global {
  namespace Express {
    interface Request {
      userId?: any;
    }
  }
}

export class session{

  static sessionCheck = async (req, res, next)=> {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
    }
    try {
      const ans:any = jwt.verify(token, SEC_KEY);
      const client = createClient();  client.on("error", (err) => console.log("redis Client Error", err));  
      await client.connect();          
      const rediscontent = await client.get(`status:${ans.id}`);
      if(rediscontent){
        req.userId = ans.id;
        next();
      }else{
        const session = await Session.findOne({
          userID:ans.id,
          isActive:true,
        });
        if (session) {
          req.userId = ans.id;
          next();
        } else {
          res.status(401).json({Message: constants.errorMsgs.authFailed});
        }
      }
    } catch (error) {
      res.status(401).json({Message: constants.errorMsgs.invalidToken});
      return;
    }
  };  

  static instructorSessionCheck = async (req, res, next)=> {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
    }
    try {
      const ans:any = jwt.verify(token, SEC_KEY);
      const instructor = await User.findOne({_id: ans.id})
      if(instructor.role == "instructor"){
        const client = createClient();  client.on("error", (err) => console.log("redis Client Error", err));  
        await client.connect();          
        const rediscontent = await client.get(`status:${ans.id}`);
        if(rediscontent){
          req.userId = ans.id;
          next();
        }else{
          const session = await Session.findOne({
            userID:ans.id,
            isActive:true,
          });
          if (session) {
            req.userId = ans.id;
            next();
          } else {
            res.status(401).json({Message: constants.errorMsgs.authFailed})
          }
        }  
      }else{
        res.status(401).json({Message: constants.warningMsgs.notAllowed})
      }
  } catch (error) {
    res.status(401).json({Message: constants.errorMsgs.invalidToken})
    return;
  }
};
}