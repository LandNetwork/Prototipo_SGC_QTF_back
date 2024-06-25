import { Arg, Query, Resolver } from "type-graphql";
import { Metadata } from "../schemas/metadata";
import {getJoinedTableData, getTableData, getTableMetadata, getTableRelationships} from "../db/model";
import { rawToMetadata } from "../mapper/metamapper";
import logger from "../config/logger";
import GraphQLJSON from "graphql-type-json";

@Resolver(Metadata)
export class MetadataResolver {
    @Query(() => [Metadata], { nullable: true })
    async tableMetadata(@Arg("tableName") tableName: string): Promise<Metadata[] | null> {
        try {
            const metadataResult = await getTableMetadata(tableName);
            const relationshipsResult = await getTableRelationships(tableName);
            return rawToMetadata(metadataResult, relationshipsResult);
        } catch (error) {
            logger.error(`Error fetching table metadata: ${error}`);
            return null;
        }
    }
}

@Resolver()
export class DataResolver {
    @Query(() => GraphQLJSON, { nullable: true })
    async tableData(
        @Arg("tableName") tableName: string,
        @Arg("columns", () => [String], { nullable: true }) columns?: string[]
    ): Promise<any> {
        try {
            return await getTableData(tableName, columns);
        } catch (error) {
            logger.error(`Error fetching table data: ${error}`);
            return null;
        }
    }
}

@Resolver()
export class JoinedDataResolver {
    @Query(() => GraphQLJSON, { nullable: true })
    async joinedTableData(
        @Arg("tableName") tableName: string,
        @Arg("relationships", () => [GraphQLJSON]) relationships: { columnName: string; isReference: boolean; referenceTable: string; referenceColumn: string }[]
    ): Promise<any> {
        try {
            return await getJoinedTableData(tableName, relationships);
        } catch (error) {
            logger.error(`Error fetching joined table data: ${error}`);
            return null;
        }
    }
}