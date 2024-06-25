import datasource from "../config/datasource";
import logger from "../config/logger";

const db = datasource;

export async function getTableData(table: string, columns?: string[]) {
    try {
        const selectedColumns = columns && columns.length > 0 ? columns : ['*'];
        return await db.select(...selectedColumns).from(`gestion.${table}`);
    } catch (error) {
        logger.error("Failed to retrieve data:", error);
        throw error; 
    }
}

export async function getJoinedTableData(table: string, relationships: any[]) {
    try {
        // Start building the query by selecting specific columns
        let query = db.select().from(`gestion.${table}`);

        // Keep track of selected columns to avoid duplication
        const selectedColumns: any[] = [];

        // Iterate through the relationships to add columns or joins as needed
        relationships.forEach((rel) => {
        if (rel.isReference) {
            query = query.leftJoin(
            `gestion.${rel.referenceTable} AS ${rel.referenceTable}_${rel.referenceColumn}`,
            `${table}.${rel.columnName}`,
            `${rel.referenceTable}_${rel.referenceColumn}.${rel.referenceColumn}`
            ).select(`${rel.referenceTable}_${rel.referenceColumn}.dispname AS ${rel.columnName}`);
        } else {
            selectedColumns.push(`${table}.${rel.columnName}`);
        }
        });

        // Add non-reference columns to the select statement
        if (selectedColumns.length > 0) {
        query = query.select(selectedColumns);
        }

        return await query;
    } catch (error) {
        logger.error("Failed to retrieve data with joins:", error);
        throw error;
    }
}

export async function getTableMetadata(tableName: string) {
    try {
        return await db.raw(
            `
            SELECT 
                column_name, 
                data_type, 
                character_maximum_length, 
                column_default, 
                is_nullable
            FROM 
                INFORMATION_SCHEMA.COLUMNS
            WHERE 
                table_name = ? 
                AND table_schema = 'gestion';
            `,
            [tableName]
        );
    } catch (error) {
        logger.error("Failed to retrieve table metadata:", error);
        throw error;
    }
}

export async function getTableRelationships(tableName: string) {
    try {
        return await db.raw(
            `
            SELECT 
                con.conname AS constraint_name,
                tbl.relname AS table_name,
                a.attname AS column_name,
                ftbl.relname AS referenced_table,
                fa.attname AS referenced_column
            FROM 
                pg_constraint con
            JOIN 
                pg_class tbl ON tbl.oid = con.conrelid
            JOIN 
                pg_attribute a ON a.attnum = ANY(con.conkey) AND a.attrelid = tbl.oid
            JOIN 
                pg_class ftbl ON ftbl.oid = con.confrelid
            JOIN 
                pg_attribute fa ON fa.attnum = ANY(con.confkey) AND fa.attrelid = ftbl.oid
            WHERE 
                con.contype = 'f' AND tbl.relname = ?;
            `,
            [tableName]
        );
    } catch (error) {
        logger.error("Failed to retrieve table relationships:", error);
        throw error;
    }
}

export async function insert(table_name: string, insertQuery: any): Promise<number> {
    try {
        const [result] = await db(`gestion.${table_name}`).insert(insertQuery).returning('t_id');
        return result.t_id;
    } catch (error) {
        logger.error("Failed to insert data:", error);
        throw error;
    }
}