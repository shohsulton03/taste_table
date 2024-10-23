import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateMenuDto {
  @Field()
  category_id: string;

  @Field()
  restaurant_id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  price: string;

  @Field()
  image_url: string;

  @Field()
  status: string;

  @Field()
  language_id: string;
}
