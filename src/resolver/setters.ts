import { Mutation, Resolver, Arg } from "type-graphql";
import { insert } from "../db/model";
import logger from "../config/logger";
import { InsertInput, InsertResponse } from "../schemas/insert";
import { dtoToInsert } from "../mapper/insertmapper";


@Resolver()
export class InsertResolver {
  @Mutation(() => InsertResponse)
  async insertData(
    @Arg("data") data: InsertInput
  ): Promise<InsertResponse> {
    try {
      const toInsert = dtoToInsert(data.toInsert);
      const id = await insert(data.table_name, toInsert);
      return { success: true, id };
    } catch (error) {
      logger.error(`Error while inserting table data: ${error}`);
      if (error instanceof Error) {
        return { success: false, message: error.message };
      } else {
        return { success: false, message: "Unknown error occurred" };
      }
    }
  }
}