// app/landing/page.tsx (ou app/page.tsx)

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button'; // Apenas buttonVariants se não usar <Button> aqui
import { cn } from "@/lib/utils";
import { MapPin, Users, CalendarDays, Building, UserCheck, Target, Zap, Star, PlayCircle } from 'lucide-react';

// Componente reutilizável para seções
const Section = ({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`py-16 md:py-24 ${className || ''}`}>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
  </section>
);

// Componente para Card de Funcionalidade
const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg text-center flex flex-col items-center border border-border">
    <div className="flex-shrink-0 flex justify-center items-center mb-5 bg-primary/10 dark:bg-primary/20 rounded-full w-16 h-16"> {/* Accent verde neon sutil no fundo do ícone */}
      <Icon className="w-8 h-8 text-primary" /> {/* Ícone com accent verde neon */}
    </div>
    <h3 className="font-sans text-xl font-semibold text-foreground mb-3">{title}</h3>
    <p className="font-sans text-muted-foreground flex-grow text-sm">{description}</p>
  </div>
);

// Componente para Card de Público-Alvo
const AudienceCard = ({ icon: Icon, title, description, benefits }: { icon: React.ElementType; title: string; description: string; benefits: string[] }) => (
    <div className="bg-card text-card-foreground p-8 rounded-xl shadow-xl transform hover:scale-[1.03] transition-transform duration-300 border border-border">
        <div className="flex items-center mb-5">
            <Icon className="w-10 h-10 text-primary mr-4" /> {/* Ícone com accent verde neon */}
            <h3 className="font-sans text-2xl font-semibold text-foreground">{title}</h3>
        </div>
        <p className="font-sans text-muted-foreground mb-5 text-base">{description}</p>
        <ul className="space-y-3">
            {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start font-sans text-sm">
                    <Zap className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" /> {/* Ícone de benefício com accent verde neon */}
                    <span className="text-foreground">{benefit}</span>
                </li>
            ))}
        </ul>
        <Link
            href="/register" // Ajustar rota se necessário
            className={cn(
                buttonVariants({ variant: "link" }),
                "mt-6 text-primary px-0 font-sans font-semibold text-base" // Link com accent verde neon
            )}
        >
            Saiba mais →
        </Link>
    </div>
);


export default function LandingPage() {
  return (
    <>
        {/* Hero Section */}
        <Section className="bg-background text-foreground text-center relative pt-24 pb-20 md:pt-32 md:pb-28">
            <div className="relative z-10 max-w-4xl mx-auto">
                <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Sua Jornada Esportiva Começa <span className="text-primary">Aqui</span>. {/* Accent verde neon */}
                </h1>
                <p className="font-sans text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                    Descubra, agende e gerencie suas atividades esportivas, aulas e instalações com Stadion. Para atletas, instrutores e gestores.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/register" // Ajustar rota se necessário
                        className={cn(
                            buttonVariants({ size: "lg" }),
                            "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" // Botão principal com fundo verde neon
                        )}
                    >
                        Quero Começar Agora!
                    </Link>
                    <Link
                        href="#features"
                        className={cn(
                            buttonVariants({ variant: "outline", size: "lg" }),
                            "font-semibold border-foreground/50 hover:border-foreground text-foreground hover:bg-foreground/5 dark:hover:bg-white/5" // Botão outline P&B
                        )}
                    >
                        Ver Funcionalidades
                    </Link>
                </div>
                <img
                    src="https://placehold.co/1000x500/0A0A0A/39FF14?text=Stadion+em+Ação&font=Geist%20Sans" // Placeholder P&B com accent verde neon
                    alt="Demonstração da Plataforma Stadion"
                    className="mt-16 rounded-lg shadow-2xl mx-auto border-2 border-border" // Borda mais sutil
                    width={1000}
                    height={500}
                />
            </div>
        </Section>

        {/* Features Section */}
        <Section id="features" className="bg-background text-foreground">
          <div className="text-center mb-16">
            <h2 className="font-sans text-3xl sm:text-4xl font-bold mb-3">
              Uma Plataforma <span className="text-primary">Completa</span> para Todos {/* Accent verde neon */}
            </h2>
            <p className="font-sans mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos ferramentas poderosas para atletas, instrutores e gestores de instalações esportivas com Stadion.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={MapPin} title="Explore Locais Próximos" description="Encontre quadras, academias e outros espaços esportivos. Verifique disponibilidade e recursos." />
            <FeatureCard icon={CalendarDays} title="Agendamento Inteligente" description="Marque suas aulas, treinos ou reserve espaços em poucos cliques. Sincronize com sua agenda." />
            <FeatureCard icon={UserCheck} title="Conecte-se com Profissionais" description="Descubra instrutores qualificados, verifique avaliações e agende aulas personalizadas." />
            <FeatureCard icon={Building} title="Gestão de Instalações" description="Para gerentes: administre suas quadras, equipamentos, horários e reservas de forma eficiente." />
            <FeatureCard icon={Target} title="Agenda para Instrutores" description="Para instrutores: organize suas aulas, gerencie alunos, defina sua disponibilidade e pagamentos." />
            <FeatureCard icon={PlayCircle} title="Acompanhe e Evolua" description="Monitore seu progresso, frequência e, para gestores, acesse dados de ocupação e receita." />
          </div>
        </Section>

        {/* For You Section */}
        <Section id="for-you" className="bg-background text-foreground">
            <div className="text-center mb-16">
                <h2 className="font-sans text-3xl sm:text-4xl font-bold mb-3">
                    Feito <span className="text-primary">Sob Medida</span> para Você {/* Accent verde neon */}
                </h2>
                <p className="font-sans mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Não importa seu papel no mundo esportivo, Stadion tem a solução ideal.
                </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-10">
                <AudienceCard icon={Users} title="Para Atletas e Alunos" description="Sua paixão pelo esporte, simplificada. Encontre, agende e evolua com Stadion." benefits={["Descubra instalações esportivas próximas.", "Agende aulas e treinos com facilidade.", "Conecte-se com os melhores instrutores.", "Acompanhe seu desenvolvimento."]} />
                <AudienceCard icon={UserCheck} title="Para Instrutores" description="Concentre-se no que faz de melhor: ensinar. Deixe a gestão com Stadion." benefits={["Gerencie sua agenda de aulas de forma integrada.", "Divulgue seus serviços e alcance mais alunos.", "Facilite pagamentos e comunicação.", "Aumente sua visibilidade profissional."]} />
                <AudienceCard icon={Building} title="Para Gerentes de Instalações" description="Maximize o potencial do seu espaço esportivo com as ferramentas inteligentes de Stadion." benefits={["Otimize a gestão de quadras, recursos e equipamentos.", "Controle agendamentos e evite conflitos.", "Aumente a taxa de ocupação e receita.", "Ofereça uma experiência moderna aos seus clientes."]} />
            </div>
        </Section>

        {/* How It Works Section */}
        <Section id="how-it-works" className="bg-card text-foreground">
          <div className="text-center mb-12">
            <h2 className="font-sans text-3xl sm:text-4xl font-semibold mb-3">
              Comece em Poucos Passos
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6">
              <div className="bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold mb-6 shadow-md">1</div>
              <h3 className="font-sans text-xl font-semibold text-foreground mb-2">Crie sua Conta</h3>
              <p className="font-sans text-muted-foreground text-sm">Rápido e fácil. Escolha seu perfil e comece a explorar.</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold mb-6 shadow-md">2</div>
              <h3 className="font-sans text-xl font-semibold text-foreground mb-2">Explore e Personalize</h3>
              <p className="font-sans text-muted-foreground text-sm">Encontre o que precisa ou configure seu espaço/serviços.</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold mb-6 shadow-md">3</div>
              <h3 className="font-sans text-xl font-semibold text-foreground mb-2">Agende e Gerencie</h3>
              <p className="font-sans text-muted-foreground text-sm">Marque suas atividades ou administre sua operação com eficiência.</p>
            </div>
          </div>
        </Section>

        {/* Testimonials Section */}
        <Section id="testimonials" className="bg-background text-foreground">
            <div className="text-center mb-16">
                <h2 className="font-sans text-3xl sm:text-4xl font-bold mb-3">
                    Amado por <span className="text-primary">Esportistas</span> e <span className="text-primary">Gestores</span> {/* Accent verde neon */}
                </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="bg-card text-card-foreground p-8 rounded-lg shadow-xl border border-border">
                    <div className="flex items-center mb-4"> <img src="https://placehold.co/60x60/0A0A0A/FFFFFF?text=AS&font=Geist%20Sans" alt="Ana Silva" className="w-14 h-14 rounded-full mr-4 border-2 border-primary/30"/> <div> <p className="font-sans font-semibold text-lg text-foreground">Ana Silva</p> <p className="font-sans text-sm text-primary">Jogadora de Vôlei</p> </div> </div> <p className="font-sans text-muted-foreground italic mb-4 text-sm">"Finalmente um app que entende o que eu preciso! Encontrar quadras e marcar treinos com Stadion ficou muito mais fácil. Recomendo!"</p> <div className="flex">{Array(5).fill(0).map((_, i) => <Star key={i} className="w-5 h-5 text-primary fill-primary" />)} {/* Estrelas com accent verde neon */} </div>
                </div>
                <div className="bg-card text-card-foreground p-8 rounded-lg shadow-xl border border-border">
                    <div className="flex items-center mb-4"> <img src="https://placehold.co/60x60/0A0A0A/FFFFFF?text=RP&font=Geist%20Sans" alt="Rafael Pires" className="w-14 h-14 rounded-full mr-4 border-2 border-primary/30"/> <div> <p className="font-sans font-semibold text-lg text-foreground">Rafael Pires</p> <p className="font-sans text-sm text-primary">Personal Trainer</p> </div> </div> <p className="font-sans text-muted-foreground italic mb-4 text-sm">"Gerenciar minha agenda com Stadion é um alívio. Tudo organizado, novos clientes e pagamentos simples. Show!"</p> <div className="flex">{Array(5).fill(0).map((_, i) => <Star key={i} className="w-5 h-5 text-primary fill-primary" />)} {/* Estrelas com accent verde neon */} </div>
                </div>
                <div className="bg-card text-card-foreground p-8 rounded-lg shadow-xl border border-border">
                    <div className="flex items-center mb-4"> <img src="https://placehold.co/60x60/0A0A0A/FFFFFF?text=LM&font=Geist%20Sans" alt="Lúcia Mendes" className="w-14 h-14 rounded-full mr-4 border-2 border-primary/30"/> <div> <p className="font-sans font-semibold text-lg text-foreground">Lúcia Mendes</p> <p className="font-sans text-sm text-primary">Gerente de Complexo</p> </div> </div> <p className="font-sans text-muted-foreground italic mb-4 text-sm">"A ocupação das quadras aumentou com Stadion! A gestão de reservas e equipamentos ficou muito mais eficiente."</p> <div className="flex">{Array(5).fill(0).map((_, i) => <Star key={i} className="w-5 h-5 text-primary fill-primary" />)} {/* Estrelas com accent verde neon */} </div>
                </div>
            </div>
        </Section>

        {/* Call to Action Section */}
        {/* MODIFICADO: Fundo escuro (foreground) com texto claro (background) para contraste P&B forte, ou bg-primary se quiser o verde neon como fundo */}
        <Section id="cta" className="bg-foreground text-background dark:bg-background dark:text-foreground">
          <div className="text-center max-w-3xl mx-auto py-10">
            <Zap className="w-16 h-16 text-primary mx-auto mb-6" /> {/* Ícone Zap com accent verde neon */}
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Pronto para Elevar sua Experiência Esportiva?
            </h2>
            <p className="font-sans text-lg sm:text-xl text-muted-foreground dark:text-background/80 mb-10"> {/* Ajuste para texto no fundo escuro */}
              Junte-se à comunidade Stadion. Crie sua conta gratuita e explore todo o potencial da nossa plataforma.
            </p>
            <Link
                href="/register" // Ajustar rota se necessário
                className={cn(
                    buttonVariants({ size: "lg" }),
                    "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-10 py-3 text-lg" // Botão com fundo verde neon
                )}
            >
                Criar Minha Conta Gratuitamente
            </Link>
          </div>
        </Section>

      {/* Footer */}
      <footer className="bg-background border-t border-border text-muted-foreground py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8 text-sm">
                <div> <h3 className="font-sans text-xl font-semibold text-foreground mb-3">Stadion</h3> <p className="font-sans">Simplificando o mundo dos esportes para todos.</p> </div>
                <div> <h4 className="font-sans font-semibold text-foreground mb-3">Links Rápidos</h4> <ul className="space-y-2 font-sans"> <li><Link href="#features" className="hover:text-primary">Funcionalidades</Link></li> <li><Link href="#for-you" className="hover:text-primary">Para Você</Link></li> <li><Link href="/facilities" className="hover:text-primary">Instalações</Link></li> <li><Link href="/instructors" className="hover:text-primary">Instrutores</Link></li> </ul> </div>
                <div> <h4 className="font-sans font-semibold text-foreground mb-3">Legal</h4> <ul className="space-y-2 font-sans"> <li><Link href="/privacy" className="hover:text-primary">Política de Privacidade</Link></li> <li><Link href="/terms" className="hover:text-primary">Termos de Uso</Link></li> <li><Link href="/contact" className="hover:text-primary">Contato</Link></li> </ul> </div>
            </div>
          <div className="text-center text-xs font-sans border-t border-border pt-8"> <p>© {new Date().getFullYear()} Stadion. Todos os direitos reservados.</p> <p>Um projeto UPX Facens - Domótica.</p> </div>
        </div>
      </footer>
    </>
  );
}