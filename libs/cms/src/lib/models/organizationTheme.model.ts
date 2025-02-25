import { Field, ObjectType } from '@nestjs/graphql'

interface IOrganizationTheme {
  gradientStartColor?: string
  gradientEndColor?: string
  useGradientColor?: boolean
  backgroundColor?: string
  darkText?: boolean
  fullWidth?: boolean
  textColor?: string
  imagePadding?: string
  imageIsFullHeight?: boolean
  imageObjectFit?: 'contain' | 'cover'
  imageObjectPosition?: 'left' | 'center' | 'right'
}

@ObjectType()
export class OrganizationTheme {
  @Field()
  gradientStartColor!: string

  @Field()
  gradientEndColor!: string

  @Field(() => Boolean, { nullable: true })
  useGradientColor?: boolean

  @Field(() => String, { nullable: true })
  backgroundColor?: string

  @Field(() => Boolean, { nullable: true })
  fullWidth?: boolean

  @Field(() => String, { nullable: true })
  textColor?: string

  @Field(() => String, { nullable: true })
  imagePadding?: string

  @Field(() => Boolean, { nullable: true })
  imageIsFullHeight?: boolean

  @Field(() => String, { nullable: true })
  imageObjectFit?: string

  @Field(() => String, { nullable: true })
  imageObjectPosition?: string
}

export const mapOrganizationTheme = (
  theme: IOrganizationTheme,
): OrganizationTheme => {
  let textColor = theme.darkText === false ? 'white' : 'dark400'

  if (theme.textColor) {
    textColor = theme.textColor
  }

  return {
    gradientStartColor: theme.gradientStartColor ?? '',
    gradientEndColor: theme.gradientEndColor ?? '',
    useGradientColor: !theme.useGradientColor ? false : true,
    backgroundColor: theme.backgroundColor ?? '',
    fullWidth: !theme.fullWidth ? false : true,
    textColor,
    imagePadding: theme.imagePadding || '0px',
    imageIsFullHeight: theme.imageIsFullHeight ?? true,
    imageObjectFit: theme.imageObjectFit ?? 'cover',
    imageObjectPosition: theme.imageObjectPosition ?? 'center',
  }
}
