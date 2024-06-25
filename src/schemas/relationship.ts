import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Relationship {
    @Field()
    constraint_name!: string;

    @Field()
    table_name!: string;

    @Field()
    column_name!: string;

    @Field()
    referenced_table!: string;

    @Field()
    referenced_column!: string;
}
