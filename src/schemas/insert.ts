import { ObjectType, Field, InputType } from "type-graphql";

@InputType()
class InsertValues {
  @Field()
  column_name!: string;

  @Field()
  value!: string;
}

@InputType()
export class InsertInput {
  @Field()
  table_name!: string;

  @Field(type => [InsertValues])
  toInsert!: InsertValues[];
}

@ObjectType()
export class InsertResponse {
    @Field()
    success!: boolean;

    @Field({ nullable: true })
    message?: string;

    @Field({ nullable: true })
    id?: number;
}
