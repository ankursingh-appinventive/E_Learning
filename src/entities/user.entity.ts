import baseDao from "./base.entity"

class UserDao extends baseDao{
    async getUser(condition){
        return await this.findOne("User",condition);
    }

    async getUserById(condition){
        return await this.findById("User",condition);
    }

    async createUser(payload){
        return await this.create("User",payload);
    }

}

export const userDao = new UserDao();