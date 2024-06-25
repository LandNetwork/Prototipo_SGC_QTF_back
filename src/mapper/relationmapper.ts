import {Relationship} from "../schemas/relationship";

export function rawToRelationship(data: any, exceptions?: string): Relationship[] {
    const exceptionArray = exceptions ? exceptions.split(',') : [];
    
    return data.rows
        .filter((row: any) => !exceptionArray.includes(row.referenced_table)) // Filter out rows based on exceptions
        .map((row: any) => {
            return {
                constraint_name: row.constraint_name,
                table_name: row.table_name, 
                column_name: row.column_name,
                referenced_table: row.referenced_table,
                referenced_column: row.referenced_column
            };
        });
}
