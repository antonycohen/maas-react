import { Infinity as InfinityIcon, FlaskConical, Globe, ShieldCheck } from 'lucide-react';

const FEATURES = [
	{
		icon: InfinityIcon,
		title: 'Un accès illimité à tous nos contenus, sans risque.',
		description:
			'Depuis 1913, nos journalistes se mobilisent chaque jour pour vous informer et lutter contre les pseudos-science.',
	},
	{
		icon: FlaskConical,
		title: 'Ne gardez plus jamais une question sans réponse.',
		description:
			'Nous avons à cœur de décrypter les incroyables découvertes de la science, ses formidables espoirs et ses vertigineux casse-tête.',
	},
	{
		icon: Globe,
		title: 'Le magazine de référence dans le domaine des sciences.',
		description:
			'En vous abonnant à Tangente Magazine, vous rejoignez les centaines de milliers de lecteurs qui nous ont fait confiance.',
	},
	{
		icon: ShieldCheck,
		title: 'Une information scientifique riche et vérifiée.',
		description:
			'Seuls les abonnés bénéficient d\'un accès complet au site Tangente Magazine, à l’application et au magazine (version papier ou numérique).',
	},
];

export function PricingBottomSection() {
	return (
		<div className="flex w-full justify-center bg-secondary py-10">
			<div className="flex w-full max-w-[1220px] flex-col gap-6">
				<h3 className="font-heading text-[34px] font-semibold leading-10 tracking-[-0.85px] text-foreground">
					Ce que chaque formule vous offre :
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
					{FEATURES.map((feature, index) => (
						<div key={index} className="flex flex-col gap-3 pt-5 pr-5">
							<div className="h-10 w-10">
								<feature.icon
									className="h-full w-full text-foreground"
									strokeWidth={1.5}
								/>
							</div>
							<div className="flex flex-col gap-1">
								<p className="text-base text-foreground">
									<span className="font-semibold">{feature.title}</span>{' '}
									<span className="text-text-secondary">
										{feature.description}
									</span>
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
