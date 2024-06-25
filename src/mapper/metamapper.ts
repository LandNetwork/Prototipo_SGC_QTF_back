import { Metadata } from "../schemas/metadata";

export function rawToMetadata(metadataResult: any, relationshipsResult: any): Metadata[] {
     const metadata = metadataResult.rows.map((row: any) => ({
        column_name: row.column_name,
        data_type: row.data_type,
        character_maximum_length: row.character_maximum_length || 4096,
        column_default: row.column_default || '',
        is_nullable: row.is_nullable === 'YES',
        is_reference: false,
        reference_table: null,
        reference_column: null,
    }));

    const relationships = relationshipsResult.rows.reduce((acc: any, row: any) => {
        acc[row.column_name] = {
            reference_table: row.referenced_table,
            reference_column: row.referenced_column,
        };
        return acc;
    }, {});

    return metadata.map((meta: Metadata) => {
        if (relationships[meta.column_name]) {
            meta.is_reference = true;
            meta.reference_table = relationships[meta.column_name].reference_table;
            meta.reference_column = relationships[meta.column_name].reference_column;
        }
        return meta;
    });
}
