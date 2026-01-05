import { SubscriptionCTA } from './subscription-cta';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm';


function stripIndent(markdown: string): string {
  const lines = markdown.split('\n');
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  const minIndent = Math.min(
    ...nonEmptyLines.map((line) => line.match(/^(\s*)/)![1].length),
  );
  return lines.map((line) => line.slice(minIndent)).join('\n');
}
export const ArticleContent = () => {
  const markdownContent = `
    # Vecteurs polaires et vecteurs axiaux

    Les forces et les vitesses sont habituellement représentées en physique par des vecteurs, êtres mathématiques qui contiennent une information de grandeur et de direction. Mais leur comportement lors d’un changement de repère amène à considérer, selon l’orientation de l’espace, deux types de vecteurs, les polaires et les axiaux.

    ![Snowboarder](https://placehold.co/600x420)

    Pour établir les équations différentielles décrivant le mouvement des corps dans l’espace, on choisit, de façon arbitraire, des repères, ou systèmes de coordonnées. Le principe de relativité stipule que les lois de la physique sont indépendantes du choix de ces repères inertiels, ou galiléens, et en particulier, de leur orientation.

    Paradoxalement, il n’en est pas de même des vecteurs de la physique qui apparaissent dans ces lois. Une inversion de l’orientation de l’espace fait en effet apparaître deux types de vecteurs, les vecteurs polaires et les vecteurs axiaux, souvent improprement appelés pseudo-vecteurs. Le produit vectoriel, dont la définition est intimement liée à l’orientation de l’espace, est le principal responsable de cet état de fait.

    ## Des vecteurs qui se multiplient

    La notion de produit vectoriel, implicite dans les travaux de Joseph-Louis Lagrange (1736‒1813), ne sera définie qu’en 1878 par William Kingdom Clifford (1845‒1879), qui s’inspire des quaternions de William Row...
  `;
  //TODO: create a better markdown converter utilities
  return (
    <article className="flex flex-col gap-10 items-start w-full lg:max-w-[600px]">
      <div className="flex flex-col gap-5 items-start w-full relative">
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="font-heading text-4xl leading-[40px] md:leading-[52px] md:text-[48px] font-semibold  tracking-[-1.32px]">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="font-heading text-[34px] font-semibold leading-[40px] tracking-[-0.85px]">
                {children}
              </h2>
            ),
            p: ({ children }) => (
              <p className="font-body text-[18px] leading-[26px] tracking-[-0.18px]">
                {children}
              </p>
            ),
            img: ({ src, alt }) => (
              <picture className="aspect-[600/420] w-full rounded-[4px] overflow-hidden bg-gray-200">
                <img
                  src={src ?? ''}
                  alt={alt ?? ''}
                  className="object-cover w-full h-full"
                />
              </picture>
            ),
          }}
        >
          {stripIndent(markdownContent)}
        </Markdown>
        <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>
      <SubscriptionCTA />
    </article>
  );
};
