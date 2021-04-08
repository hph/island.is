import React, { ReactNode } from 'react'
import { Image, OrganizationPage } from '@island.is/web/graphql/schema'
import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Navigation,
  NavigationItem,
  Text,
} from '@island.is/island-ui/core'
import NextLink from 'next/link'
import { HeadWithSocialSharing, Main, Sticky } from '@island.is/web/components'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { SyslumennHeader, SyslumennFooter } from './Themes/SyslumennTheme'
import { DigitalIcelandHeader } from './Themes/DigitalIcelandTheme'
import { DefaultHeader } from './Themes/DefaultTheme'

interface NavigationData {
  title: string
  activeItemTitle?: string
  items: NavigationItem[]
}

interface WrapperProps {
  pageTitle: string
  pageDescription?: string
  pageFeaturedImage?: Image
  organizationPage?: OrganizationPage
  breadcrumbItems?: BreadCrumbItem[]
  mainContent?: ReactNode
  sidebarContent?: ReactNode
  navigationData: NavigationData
  fullWidthContent?: boolean
  minimal?: boolean
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

export const lightThemes = ['digital_iceland']

const OrganizationHeader: React.FC<HeaderProps> = ({ organizationPage }) => {
  switch (organizationPage.theme) {
    case 'syslumenn':
      return <SyslumennHeader organizationPage={organizationPage} />
    case 'digital_iceland':
      return <DigitalIcelandHeader organizationPage={organizationPage} />
    default:
      return <DefaultHeader organizationPage={organizationPage} />
  }
}

const OrganizationFooter: React.FC<HeaderProps> = ({ organizationPage }) => {
  switch (organizationPage.theme) {
    case 'syslumenn':
      return <SyslumennFooter organizationPage={organizationPage} />
    default:
      return null
  }
}

export const OrganizationWrapper: React.FC<WrapperProps> = ({
  pageTitle,
  pageDescription,
  pageFeaturedImage,
  organizationPage,
  breadcrumbItems,
  mainContent,
  sidebarContent,
  navigationData,
  children,
  minimal = false,
}) => {
  return (
    <>
      <HeadWithSocialSharing
        title={pageTitle}
        description={pageDescription}
        imageUrl={pageFeaturedImage?.url}
        imageContentType={pageFeaturedImage?.contentType}
        imageWidth={pageFeaturedImage?.width?.toString()}
        imageHeight={pageFeaturedImage?.height?.toString()}
      />
      <OrganizationHeader organizationPage={organizationPage} />
      <Main>
        {!minimal && (
          <SidebarLayout
            paddingTop={[2, 2, 9]}
            paddingBottom={[4, 4, 4]}
            isSticky={false}
            sidebarContent={
              <Sticky>
                <Navigation
                  baseId="pageNav"
                  items={navigationData.items}
                  title={navigationData.title}
                  activeItemTitle={navigationData.activeItemTitle}
                  renderLink={(link, item) => {
                    return item?.href ? (
                      <NextLink href={item?.href}>{link}</NextLink>
                    ) : (
                      link
                    )
                  }}
                />
                {sidebarContent}
              </Sticky>
            }
          >
            <Hidden above="sm">
              <Box marginY={2}>
                <Navigation
                  baseId="pageNav"
                  isMenuDialog={true}
                  items={navigationData.items}
                  title={navigationData.title}
                  activeItemTitle={navigationData.activeItemTitle}
                  renderLink={(link, item) => {
                    return item?.href ? (
                      <NextLink href={item?.href}>{link}</NextLink>
                    ) : (
                      link
                    )
                  }}
                />
              </Box>
            </Hidden>
            <Breadcrumbs
              items={breadcrumbItems ?? []}
              renderLink={(link, item) => {
                return item?.href ? (
                  <NextLink href={item?.href}>{link}</NextLink>
                ) : (
                  link
                )
              }}
            />
            {pageDescription && (
              <Box paddingTop={[2, 2, 5]} paddingBottom={2}>
                <Text variant="intro">{pageDescription}</Text>
              </Box>
            )}
            <Hidden above="sm">{sidebarContent}</Hidden>
            <Box paddingTop={4}>{mainContent ?? children}</Box>
          </SidebarLayout>
        )}
        {!!mainContent && children}
        {minimal && (
          <GridContainer>
            <GridRow>
              <GridColumn
                paddingTop={6}
                span={['12/12', '12/12', '10/12']}
                offset={['0', '0', '1/12']}
              >
                {children}
              </GridColumn>
            </GridRow>
          </GridContainer>
        )}
      </Main>
      {!minimal && <OrganizationFooter organizationPage={organizationPage} />}
    </>
  )
}
