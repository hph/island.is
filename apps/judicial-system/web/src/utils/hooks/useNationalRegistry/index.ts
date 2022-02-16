import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'

import {
  NationalRegistryResponseBusiness,
  NationalRegistryResponsePerson,
} from '@island.is/judicial-system-web/src/types'

import { validate } from '../../validate'
import { isBusiness } from '../../stepHelper'

const useNationalRegistry = (nationalId?: string) => {
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)
  const isMounted = useRef(false)
  const { isValid: isValidNationalId } = validate(
    nationalId ?? '',
    'national-id',
  )

  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const {
    data: personData,
    error: personError,
  } = useSWR<NationalRegistryResponsePerson>(
    shouldFetch && isValidNationalId && !isBusiness(nationalId)
      ? `/api/nationalRegistry/getPersonByNationalId?nationalId=${nationalId}`
      : null,
    fetcher,
  )

  const {
    data: businessData,
    error: businessError,
  } = useSWR<NationalRegistryResponseBusiness>(
    shouldFetch && isValidNationalId && isBusiness(nationalId)
      ? `/api/nationalRegistry/getBusinessesByNationalId?nationalId=${nationalId}`
      : null,
    fetcher,
  )

  useEffect(() => {
    if (shouldFetch) {
      return
    } else if (isMounted.current) {
      setShouldFetch(true)
    } else {
      isMounted.current = true
    }
  }, [nationalId])

  return {
    personData,
    personError,
    businessData,
    businessError,
  }
}

export default useNationalRegistry
