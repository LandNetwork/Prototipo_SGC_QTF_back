import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Metadata {
    @Field()
    column_name!: string;

    @Field()
    data_type!: string;

    @Field()
    character_maximum_length!: number;

    @Field()
    column_default!: string;

    @Field()
    is_nullable!: boolean;

    @Field()
    is_reference!: boolean;

    @Field({ nullable: true })
    reference_table?: string;

    @Field({ nullable: true })
    reference_column?: string;
}
