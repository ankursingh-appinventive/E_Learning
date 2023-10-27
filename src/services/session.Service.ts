import {Session} from '../models/session.Model'
import { SetOptions, createClient } from 'redis';

export class sessionSer{
    static createSession = async (userId, deviceId) => {
        try {
          const session = await Session.create({
            userId,
            isActive: true,
            deviceId
          });
          const client = createClient();  client.on("error", (err) => console.log("redis Client Error", err));  await client.connect();
          const options: SetOptions = { EX: 60*60*5 };
          await client.set(`status:${userId}`, 'true', options);
          return session;
        } catch (error) {
          console.error(error);
          throw new Error('Something went wrong in creating user session.');
        }
      };
}

