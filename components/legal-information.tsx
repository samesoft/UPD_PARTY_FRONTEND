import Link from "next/link";

interface LegalInformationProps {
  className?: string;
}

export default function LegalInformation({
  className = "",
}: LegalInformationProps) {
  return (
    <div
      className={`max-w-4xl mx-auto space-y-4 text-sm text-gray-600 bg-white p-6 rounded-lg  ${className}`}
    >
      <h2 className="text-lg font-bold text-gray-900">
        XEERKA XISBIYADA SIYAASADDA, DOORASHOOYINKA IYO AFTI-RAACYADA 2000
        (PPERA)
      </h2>

      <p>
        Sida uu qabo{" "}
        <em>
          Xeerka Xisbiyada Siyaasadda, Doorashooyinka iyo Afti-raacyada 2000
          (PPERA)
        </em>{" "}
        waa inaad ku jirtaa diiwaanka cod-bixiyeyaasha Mareykanka marka laga
        reebo dhulalka hoostagaa si aad u sameyso deeq ka badan $500.
      </p>

      <p>
        Haddii aad Xisbiga u deeqdo in ka badan $11,180, waxaa naga waajib ah
        sida uu qabo{" "}
        <em>
          Xeerka Xisbiyada Siyaasadda, Doorashooyinka iyo Afti-raacyada 2000
        </em>{" "}
        inaan ka warbixinno deeqdaas Guddiga Doorashooyinka, kaas oo daabici
        doona xaqiiqda ah inaad samaysay deeq ka badan $11,180. Wixii macluumaad
        dheeraad ah, fadlan ka eeg{" "}
        <Link
          href="https://www.@example.com"
          className="text-secondary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.@example.com
        </Link>
        .
      </p>

      <p>
        Dhammaan deeqaha loo sameeyo ololahan uruurinta lacagta ee aan xadidnayn
        waxaa loo isticmaali doonaa taageeridda ololaha siyaasadeed iyo
        hawlgallada Xisbiga, mana aha mid waqti xadidan.
      </p>

      <p>
        Xisbigu wuxuu xaq u leeyahay inuusan aqbalin deeq ama codsiga
        xubinnimada.
      </p>

      <p>
        Deeq-bixinta Xisbiga, ha ahaato si dhexe ama si maxalli ah, si toos ah
        kuuguma sameeynayso xubin ka tirsan Xisbiga. Haddii aad rabto inaad
        noqoto xubin ka tirsan Xisbiga fadlan iska diiwaan geli oo ku biir{" "}
        <Link href="/join" className="text-secondary hover:underline">
          boggeena xubinnimada
        </Link>
        .
      </p>

      <p>
        Xogta maaliyadeed sida lambarrada kaararka lacag-bixinta waxaa
        isticmaali doona Xisbiga, waxaana la siin doonaa bixiyeyaasheena
        lacag-bixinta hab ammaan ah oo qayb ka ah hawlgalkeena dimuqraadiyadeed
        ee cod-bixiyeyaasha. Marka loo baahdo, xogtaada waxaa la wadaagi doona
        musharaxiinteena iyo wakiilladeena la soo doortay. Wixii macluumaad
        dheeraad ah fadlan eeg{" "}
        <Link href="/privacy" className="text-secondary hover:underline">
          ogeysiiska sirta
        </Link>
        .
      </p>
    </div>
  );
}
