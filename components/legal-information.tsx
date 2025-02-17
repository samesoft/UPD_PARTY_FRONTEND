import Link from "next/link";

interface LegalInformationProps {
  className?: string;
}

// export default function LegalInformation({ className = "" }: LegalInformationProps) {
//   return (
//     <div className={`space-y-4 text-sm text-gray-600 bg-white p-6 rounded-lg ${className}`}>
//       <h2 className="text-lg font-bold text-gray-900">POLITICAL PARTIES, ELECTIONS AND REFERENDUMS ACT 2000 (PPERA)</h2>

//       <p>
//         Under the <em>Political Parties, Elections and Referendums Act 2000 (PPERA)</em> you must be on the electoral
//         register in the US excluding territories in order to make a donation of more than $500.
//       </p>

//       <p>
//         If you donate more than $11,180 to the Party, we are obliged under the{" "}
//         <em>Political Parties, Elections and Referendums Act 2000</em> to report such a donation to the Electoral
//         Commission, who will publish the fact that you have made a donation over $11,180. For more information, please
//         see{" "}
//         <Link
//           href="https://www.electoralcommission.org.uk"
//           className="text-secondary hover:underline"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           https://www.electoralcommission.org.uk
//         </Link>
//         .
//       </p>

//       <p>
//         All donations to this unrestricted fundraising campaign will be used to support political campaigning and the
//         operations of the Party and is not time restricted.
//       </p>

//       <p>The Party reserves the right to not accept a donation or application for membership.</p>

//       <p>
//         Donating to the Party, either centrally or locally, does not automatically make you a member of the Party. If
//         you wish to become a member of the Party please sign up and join via{" "}
//         <Link href="/join" className="text-secondary hover:underline">
//           our membership page
//         </Link>
//         .
//       </p>

//       <p>
//         Any financial data such as payment card numbers will be used by The Party and will be given to our payment
//         providers via a secure method as part of our democratic engagement with electors. Where necessary, your data
//         will be shared with our candidates and elected representatives. For more information please see our{" "}
//         <Link href="/privacy" className="text-secondary hover:underline">
//           privacy notice
//         </Link>
//         .
//       </p>
//     </div>
//   )
// }

// export default function LegalInformation({
//   className = "",
// }: LegalInformationProps) {
//   return (
//     <div
//       className={`space-y-4 text-sm text-gray-600 bg-white  p-6 rounded-lg shadow-3xl ${className}`}
//     >
//       <h2 className="text-lg font-bold text-gray-900">
//         POLITICAL PARTIES, ELECTIONS AND REFERENDUMS ACT 2000 (PPERA)
//       </h2>

//       <p>
//         Under the{" "}
//         <em>Political Parties, Elections and Referendums Act 2000 (PPERA)</em>{" "}
//         you must be on the electoral register in the US excluding territories in
//         order to make a donation of more than $500.
//       </p>

//       <p>
//         If you donate more than $11,180 to the Party, we are obliged under the{" "}
//         <em>Political Parties, Elections and Referendums Act 2000</em> to report
//         such a donation to the Electoral Commission, who will publish the fact
//         that you have made a donation over $11,180. For more information, please
//         see{" "}
//         <Link
//           href="https://www.electoralcommission.org.uk"
//           className="text-secondary hover:underline"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           https://www.electoralcommission.org.uk
//         </Link>
//         .
//       </p>

//       <p>
//         All donations to this unrestricted fundraising campaign will be used to
//         support political campaigning and the operations of the Party and is not
//         time restricted.
//       </p>

//       <p>
//         The Party reserves the right to not accept a donation or application for
//         membership.
//       </p>

//       <p>
//         Donating to the Party, either centrally or locally, does not
//         automatically make you a member of the Party. If you wish to become a
//         member of the Party please sign up and join via{" "}
//         <Link href="/join" className="text-secondary hover:underline">
//           our membership page
//         </Link>
//         .
//       </p>

//       <p>
//         Any financial data such as payment card numbers will be used by The
//         Party and will be given to our payment providers via a secure method as
//         part of our democratic engagement with electors. Where necessary, your
//         data will be shared with our candidates and elected representatives. For
//         more information please see our{" "}
//         <Link href="/privacy" className="text-secondary hover:underline">
//           privacy notice
//         </Link>
//         .
//       </p>
//     </div>
//   );
// }

export default function LegalInformation({
  className = "",
}: LegalInformationProps) {
  return (
    <div
      className={`max-w-4xl mx-auto space-y-4 text-sm text-gray-600 bg-white p-6 rounded-lg  ${className}`}
    >
      <h2 className="text-lg font-bold text-gray-900">
        POLITICAL PARTIES, ELECTIONS AND REFERENDUMS ACT 2000 (PPERA)
      </h2>

      <p>
        Under the{" "}
        <em>Political Parties, Elections and Referendums Act 2000 (PPERA)</em>{" "}
        you must be on the electoral register in the US excluding territories in
        order to make a donation of more than $500.
      </p>

      <p>
        If you donate more than $11,180 to the Party, we are obliged under the{" "}
        <em>Political Parties, Elections and Referendums Act 2000</em> to report
        such a donation to the Electoral Commission, who will publish the fact
        that you have made a donation over $11,180. For more information, please
        see{" "}
        <Link
          href="https://www.electoralcommission.org.uk"
          className="text-secondary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.electoralcommission.org.uk
        </Link>
        .
      </p>

      <p>
        All donations to this unrestricted fundraising campaign will be used to
        support political campaigning and the operations of the Party and is not
        time restricted.
      </p>

      <p>
        The Party reserves the right to not accept a donation or application for
        membership.
      </p>

      <p>
        Donating to the Party, either centrally or locally, does not
        automatically make you a member of the Party. If you wish to become a
        member of the Party please sign up and join via{" "}
        <Link href="/join" className="text-secondary hover:underline">
          our membership page
        </Link>
        .
      </p>

      <p>
        Any financial data such as payment card numbers will be used by The
        Party and will be given to our payment providers via a secure method as
        part of our democratic engagement with electors. Where necessary, your
        data will be shared with our candidates and elected representatives. For
        more information please see our{" "}
        <Link href="/privacy" className="text-secondary hover:underline">
          privacy notice
        </Link>
        .
      </p>
    </div>
  );
}
