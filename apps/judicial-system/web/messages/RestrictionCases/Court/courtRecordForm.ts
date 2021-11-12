import { defineMessages } from 'react-intl'

export const rcCourtRecord = {
  sections: {
    accusedBookings: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:court_record.accused_bookings.title',
        defaultMessage: 'Bókanir um {genderedAccused}',
        description:
          'Notaður sem titill fyrir "Bókarnir um kærða" hlutann í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id:
          'judicial.system.restriction_cases:court_record.accused_bookings.label',
        defaultMessage: 'Afstaða {genderedAccused} og aðrar bókanir',
        description:
          'Notaður sem titill í "Afstaða kærða og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id:
          'judicial.system.restriction_cases:court_record.accused_bookings.tooltip',
        defaultMessage: 'Nánari útlistun á afstöðu sakbornings',
        description:
          'Notaður sem skýritexti í "afstaða kærða" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      tooltip: {
        id:
          'judicial.system.restriction_cases:court_record.accused_bookings.tooltip-2',
        defaultMessage:
          'Hér er hægt að bóka í þingbók um réttindi og afstöðu kærða, ásamt bókunum t.d. um verjanda og túlk. Hægt er að sleppa öllum bókunum hér, t.d. ef kærði er ekki viðstaddur.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "Afstaða varnaraðila og aðrar bókanir" svæðið í gæsluvarðhalds- og farbannsmálum.',
      },
      autofillRightToRemainSilent: {
        id:
          'judicial.system.restriction_cases:court_record.accused_bookings.autofill_right_to_remain_silent',
        defaultMessage:
          'Sakborningi er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Sakborningur er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.',
        description:
          'Sjálfgefinn texti í "Afstaða kærða og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      autofillCourtDocumentOne: {
        id:
          'judicial.system.restriction_cases:court_record.accused_bookings.autofill_court_document_one',
        defaultMessage: 'Sakborningi er kynnt krafa á dómskjali nr. 1.',
        description:
          'Sjálfgefinn texti í "Afstaða kærða og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      autofillAccusedPlea: {
        id:
          'judicial.system.restriction_cases:court_record.accused_bookings.autofill_accused_plea',
        defaultMessage:
          'Sakborningur mótmælir kröfunni / Sakborningur samþykkir kröfuna',
        description:
          'Sjálfgefinn texti í "Afstaða kærða og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      autofillDefender: {
        id:
          'judicial.system.restriction_cases:court_record.accused_bookings.autofill_defender',
        defaultMessage:
          '{defender} lögmaður er skipaður verjandi sakbornings að hans ósk.',
        description:
          'Sjálfgefinn texti í "Afstaða kærða og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      autofillTranslator: {
        id:
          'judicial.system.restriction_cases:court_record.accused_bookings.autofill_translator',
        defaultMessage:
          '{translator} túlkar fyrir sakborning það sem fram fer í þinghaldinu.',
        description:
          'Sjálfgefinn texti í "Afstaða kærða og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    courtLocation: defineMessages({
      label: {
        id:
          'judicial.system.restriction_cases:court_record.court_location.label',
        defaultMessage: 'Hvar var dómþing haldið?',
        description:
          'Notaður sem titill í "Hvar var dómþing haldið?" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id:
          'judicial.system.restriction_cases:court_record.court_location.placeholder',
        defaultMessage:
          'Staðsetning þinghalds, t.d. "í Héraðsdómi Reykjavíkur"',
        description:
          'Notaður sem skýritexti í "Hvar var dómþing haldið?" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      tooltip: {
        id:
          'judicial.system.restriction_cases:court_record.court_location.tooltip',
        defaultMessage:
          'Sláðu inn staðsetningu dómþings í þágufalli með forskeyti sem hefst á litlum staf. Dæmi "í Héraðsdómi Reykjavíkur". Staðsetning mun birtast með þeim hætti í upphafi þingbókar.',
        description:
          'Notaður sem upplýsingatexti í "Hvar var dómþing haldið?" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
}
