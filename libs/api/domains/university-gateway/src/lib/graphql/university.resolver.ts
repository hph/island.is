import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UniversityGatewayApi } from '../universityGateway.service'
import { UniversityGatewayUniversity } from './models'
import { Loader } from '@island.is/nest/dataloader'
import {
  OrganizationLinkByReferenceIdLoader,
  OrganizationLogoByReferenceIdLoader,
  OrganizationTitleByReferenceIdLoader,
} from '@island.is/cms'
import type {
  LogoUrl,
  OrganizationLink,
  OrganizationLinkByReferenceIdDataLoader,
  OrganizationLogoByReferenceIdDataLoader,
  OrganizationTitleByReferenceIdDataLoader,
  ShortTitle,
} from '@island.is/cms'

@Resolver(UniversityGatewayUniversity)
export class UniversityResolver {
  constructor(private readonly universityGatewayApi: UniversityGatewayApi) {}

  @Query(() => [UniversityGatewayUniversity])
  universityGatewayUniversities() {
    return this.universityGatewayApi.getUniversities()
  }

  @ResolveField('contentfulLogoUrl', () => String, { nullable: true })
  async resolveContentfulLogoUrl(
    @Loader(OrganizationLogoByReferenceIdLoader)
    organizationLogoLoader: OrganizationLogoByReferenceIdDataLoader,
    @Parent() university: UniversityGatewayUniversity,
  ): Promise<LogoUrl> {
    return await organizationLogoLoader.load(university.contentfulKey)
  }

  @ResolveField('contentfulTitle', () => String, { nullable: true })
  async resolveContentfulTitle(
    @Loader(OrganizationTitleByReferenceIdLoader)
    organizationTitleLoader: OrganizationTitleByReferenceIdDataLoader,
    @Parent() university: UniversityGatewayUniversity,
  ): Promise<ShortTitle> {
    return organizationTitleLoader.load(university.contentfulKey)
  }

  @ResolveField('contentfulLink', () => String, { nullable: true })
  async resolveContentfulLink(
    @Loader(OrganizationLinkByReferenceIdLoader)
    organizationLinkLoader: OrganizationLinkByReferenceIdDataLoader,
    @Parent() university: UniversityGatewayUniversity,
  ): Promise<OrganizationLink> {
    return organizationLinkLoader.load(university.contentfulKey)
  }
}
