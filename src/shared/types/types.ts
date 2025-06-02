import mongoose, { Types } from "mongoose";

export class ObjectId extends Types.ObjectId {};

export class ObjectIdSchemaType extends mongoose.Schema.Types.ObjectId {};

export const getObjectId = (id?: string): ObjectId => {
  return new ObjectId(id);
}
