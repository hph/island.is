import { useParams } from 'react-router-dom'
import { useGetCertificateByIdQuery } from './MedicineCertificate.generated'
import {
  Box,
  Icon,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { GoBack, UserInfoLine } from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { HealthPaths } from '../../lib/paths'
import { Problem } from '@island.is/react-spa/shared'

type UseParams = {
  type: string
  id: string
}

export const MedicineCertificate = () => {
  const params = useParams() as UseParams

  const { formatMessage, formatDateFns } = useLocale()

  const { data, loading, error } = useGetCertificateByIdQuery({
    variables: {
      input: {
        id: parseInt(params.id),
      },
    },
  })

  const certificate = data?.rightsPortalGetCertificateById

  const isLoading = loading && !error && !data
  const hasError = error && !loading && !data

  return (
    <Box paddingTop={4}>
      <Stack dividers="blueberry200" space={1}>
        {isLoading && <SkeletonLoader height={35} space={2} repeat={4} />}
        {hasError && <Problem error={error} />}
        {certificate && !isLoading && (
          <>
            <GoBack
              path={HealthPaths.HealthMedicineCertificates}
              label={formatMessage(messages.medicineLicenseIntroTitle)}
            />
            {certificate.drugName && (
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.medicineDrugName)}
                content={certificate.drugName}
                labelColumnSpan={['6/12']}
                valueColumnSpan={['6/12']}
              />
            )}
            {certificate.atcCode && (
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.medicineAtcCode)}
                content={certificate.atcCode}
                labelColumnSpan={['6/12']}
                valueColumnSpan={['6/12']}
              />
            )}
            {certificate.atcName && (
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.medicineAtcName)}
                content={certificate.atcName}
                labelColumnSpan={['6/12']}
                valueColumnSpan={['6/12']}
              />
            )}
            {certificate.validFrom && (
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.medicineValidFrom)}
                content={formatDateFns(certificate.validFrom, 'dd.MM.yyyy')}
                labelColumnSpan={['6/12']}
                valueColumnSpan={['6/12']}
              />
            )}
            {certificate.validTo && (
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.medicineValidTo)}
                content={formatDateFns(certificate.validTo, 'dd.MM.yyyy')}
                labelColumnSpan={['6/12']}
                valueColumnSpan={['6/12']}
              />
            )}
            {certificate.doctor && (
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.medicineNameOfDoctor)}
                content={certificate.doctor}
                labelColumnSpan={['6/12']}
                valueColumnSpan={['6/12']}
              />
            )}
            {certificate.approved !== null && (
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.status)}
                content={
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    columnGap="p1"
                  >
                    <Text>
                      {formatMessage(
                        certificate.processed === false
                          ? messages.medicineIsProcessedCertificate
                          : certificate.valid
                          ? messages.medicineIsValidCertificate
                          : certificate.rejected
                          ? messages.medicineIsRejectedCertificate
                          : certificate.expired
                          ? messages.medicineIsExpiredCertificate
                          : messages.medicineIsNotValidCertificate,
                      )}
                    </Text>
                    <Icon
                      icon={
                        certificate.processed === false
                          ? 'informationCircle'
                          : certificate.valid
                          ? 'checkmarkCircle'
                          : 'closeCircle'
                      }
                      color={
                        certificate.processed === false
                          ? 'blue600'
                          : certificate.valid
                          ? 'mint600'
                          : 'red600'
                      }
                      type="filled"
                    />
                  </Box>
                }
                labelColumnSpan={['6/12']}
                valueColumnSpan={['6/12']}
              />
            )}
          </>
        )}
      </Stack>
    </Box>
  )
}

export default MedicineCertificate
