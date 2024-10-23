import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateMenuDto {
  @Field({ nullable: true })
  category_id?: string;

  @Field({ nullable: true })
  restaurant_id?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  price?: string;

  @Field({ nullable: true })
  image_url?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  language_id?: string;
}
