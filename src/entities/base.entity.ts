import { ModelNames } from "../interfaces/models";
import * as models from "../models";

export default class BaseDao {

 async findOne(model: ModelNames, condition) {
 const ModelName: any = models[model];
 return await ModelName.findOne(condition)
 }

 async findById(model: ModelNames, condition) {
 const ModelName: any = models[model];
 return await ModelName.findById(condition)
 }

 async find(model: ModelNames, condition) {
 const ModelName: any = models[model];
 return await ModelName.find(condition)
 }

 async create(model: ModelNames, payload) {
 const ModelName: any = models[model];
 return await ModelName.create(payload)
 }

 async updateOne(model: ModelNames, condition, payload) {
 const ModelName: any = models[model];
 return await ModelName.updateOne(condition, { $set: payload });
 }

 async deleteOne(model: ModelNames, condition) {
 const ModelName: any = models[model];
 return await ModelName.deleteOne(condition);
 }
 
}