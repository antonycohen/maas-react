import { SubscriptionCTA } from './subscription-cta';

export const ArticleContent = () => {
  return (
    <article className="flex flex-col gap-10 items-start w-full max-w-[600px]">
      <div className="flex flex-col gap-10 items-start w-full relative">
        <h1 className="font-heading text-[48px] font-semibold leading-[52px] tracking-[-1.32px] text-black">
          Vecteurs polaires et vecteurs axiaux
        </h1>
        <p className="font-body text-[18px] font-semibold leading-[26px] tracking-[-0.18px] text-black">
          Les forces et les vitesses sont habituellement représentées en
          physique par des vecteurs, êtres mathématiques qui contiennent une
          information de grandeur et de direction. Mais leur comportement lors
          d’un changement de repère amène à considérer, selon l’orientation de
          l’espace, deux types de vecteurs, les polaires et les axiaux.
        </p>
        <div className="aspect-[600/420] w-full relative rounded-[4px] overflow-hidden bg-gray-200">
          <img
            src="https://placehold.co/600x420"
            alt="Snowboarder"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="font-body text-[18px] font-normal leading-[26px] tracking-[-0.18px] text-black space-y-6">
          <p>
            Pour établir les équations différentielles décrivant le mouvement
            des corps dans l’espace, on choisit, de façon arbitraire, des
            repères, ou systèmes de coordonnées. Le principe de relativité
            stipule que les lois de la physique sont indépendantes du choix de
            ces repères inertiels, ou galiléens, et en particulier, de leur
            orientation.
          </p>
          <p>
            Paradoxalement, il n’en est pas de même des vecteurs de la physique
            qui apparaissent dans ces lois. Une inversion de l’orientation de
            l’espace fait en effet apparaître deux types de vecteurs, les
            vecteurs polaires et les vecteurs axiaux, souvent improprement
            appelés pseudo-vecteurs. Le produit vectoriel, dont la définition est
            intimement liée à l’orientation de l’espace, est le principal
            responsable de cet état de fait.
          </p>
        </div>
        <h2 className="font-heading text-[34px] font-semibold leading-[40px] tracking-[-0.85px] text-black">
          Des vecteurs qui se multiplient
        </h2>
        <div className="relative w-full">
          <p className="font-body text-[18px] font-normal leading-[26px] tracking-[-0.18px] text-black">
            La notion de produit vectoriel, implicite dans les travaux de
            Joseph-Louis Lagrange (1736‒1813), ne sera définie qu’en 1878 par
            William Kingdom Clifford (1845‒1879), qui s’inspire des quaternions
            de William Row...
          </p>
          <div className="absolute bottom-0 left-0 w-full h-[100px] bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        </div>
      </div>
      <SubscriptionCTA />
    </article>
  );
};
