import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Sparkles, Zap, Video, DollarSign, TrendingUp, Gift, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Types
type QuizStep = 'intro' | 'name' | 'question1' | 'question2' | 'question3' | 'result';

interface QuizData {
  name: string;
  experience: string;
  comfortable: string;
  earnings: string;
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Background particles component
const BackgroundEffects = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {/* Gradient orbs */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-800/10 rounded-full blur-[150px]" />
    
    {/* Grid pattern */}
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}
    />
    
    {/* Floating particles */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

// Progress bar component
const QuizProgress = ({ current, total }: { current: number; total: number }) => {
  const progress = (current / total) * 100;
  
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex justify-between text-xs text-zinc-500 mb-2">
        <span>Progresso</span>
        <span>{current} de {total}</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-green-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// Intro Screen
const IntroScreen = ({ onStart }: { onStart: () => void }) => (
  <motion.div
    key="intro"
    variants={fadeInUp}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.5 }}
    className="text-center max-w-2xl mx-auto px-4"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-purple-500/20 to-green-500/20 border border-purple-500/30"
    >
      <Sparkles className="w-10 h-10 text-purple-400" />
    </motion.div>
    
    <motion.h1
      variants={fadeInUp}
      className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
    >
      Descubra em{' '}
      <span className="text-gradient-purple">30 segundos</span>{' '}
      se você pode ganhar dinheiro criando conteúdo UGC para marcas
    </motion.h1>
    
    <motion.p
      variants={fadeInUp}
      className="text-lg md:text-xl text-zinc-400 mb-10 max-w-xl mx-auto"
    >
      Responda algumas perguntas rápidas e veja se você tem perfil para lucrar como criador de conteúdo
    </motion.p>
    
    <motion.div variants={fadeInUp}>
      <Button
        onClick={onStart}
        size="lg"
        className="group relative px-10 py-7 text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-xl transition-all duration-300 glow-purple-soft hover:glow-purple"
      >
        Começar teste
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
    
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-zinc-500"
    >
      {[
        { icon: Zap, text: 'Resultado instantâneo' },
        { icon: Gift, text: 'Bônus exclusivo' },
        { icon: TrendingUp, text: '100% gratuito' },
      ].map((item, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          className="flex items-center gap-2"
        >
          <item.icon className="w-4 h-4 text-green-400" />
          <span>{item.text}</span>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);

// Name Input Screen
const NameScreen = ({ 
  value, 
  onChange, 
  onContinue 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  onContinue: () => void;
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onContinue();
  };

  return (
    <motion.div
      key="name"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
      className="text-center max-w-md mx-auto px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-green-500/20 to-purple-500/20 border border-green-500/30"
      >
        <span className="text-2xl">👋</span>
      </motion.div>
      
      <motion.h2
        variants={fadeInUp}
        className="text-3xl md:text-4xl font-bold text-white mb-8"
      >
        Antes de começar,{' '}
        <span className="text-gradient-green">qual é o seu nome?</span>
      </motion.h2>
      
      <form onSubmit={handleSubmit}>
        <motion.div variants={fadeInUp} className="mb-6">
          <Input
            type="text"
            placeholder="Digite seu nome"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-6 py-6 text-lg bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            autoFocus
          />
        </motion.div>
        
        <motion.div variants={fadeInUp}>
          <Button
            type="submit"
            size="lg"
            disabled={!value.trim()}
            className="w-full px-8 py-6 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-xl transition-all duration-300 glow-green-soft hover:glow-green disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

// Question Screen Component
interface QuestionScreenProps {
  question: string;
  subtitle?: string;
  options: { value: string; label: string; icon?: React.ElementType }[];
  onSelect: (value: string) => void;
  userName?: string;
}

const QuestionScreen = ({ question, subtitle, options, onSelect, userName }: QuestionScreenProps) => {
  const displayQuestion = userName ? question.replace('(Nome)', userName) : question;
  
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
      className="text-center max-w-lg mx-auto px-4"
    >
      <motion.h2
        variants={fadeInUp}
        className="text-2xl md:text-3xl font-bold text-white mb-3"
      >
        {displayQuestion}
      </motion.h2>
      
      {subtitle && (
        <motion.p variants={fadeInUp} className="text-zinc-400 mb-8">
          {subtitle}
        </motion.p>
      )}
      
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-3"
      >
        {options.map((option, index) => (
          <motion.div
            key={option.value}
            variants={fadeInUp}
            custom={index}
          >
            <Button
              variant="outline"
              onClick={() => onSelect(option.value)}
              className="group w-full px-6 py-6 text-left justify-between bg-zinc-900/60 border-zinc-700 hover:border-purple-500/50 hover:bg-zinc-800/80 text-white rounded-xl transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                {option.icon && <option.icon className="w-5 h-5 text-purple-400" />}
                <span className="text-base">{option.label}</span>
              </span>
              <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

// Result Screen
const ResultScreen = ({ userName, onCTA }: { userName: string; onCTA: () => void }) => (
  <motion.div
    key="result"
    variants={scaleIn}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.5 }}
    className="text-center max-w-2xl mx-auto px-4"
  >
    {/* Success badge */}
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-green-500/30 to-green-400/20 border-2 border-green-400/50 glow-green"
    >
      <Check className="w-12 h-12 text-green-400" />
    </motion.div>
    
    {/* Congratulations */}
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Parabéns,{' '}
        <span className="text-gradient-green">{userName}!</span>
      </h2>
    </motion.div>
    
    {/* Analysis result */}
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.5 }}
      className="glass-card rounded-2xl p-6 md:p-8 mb-8 border border-zinc-800"
    >
      <p className="text-lg text-zinc-300 leading-relaxed">
        Analisamos suas respostas e identificamos que você possui{' '}
        <span className="text-white font-semibold">perfil para ganhar dinheiro</span>{' '}
        criando conteúdo UGC para marcas.
      </p>
    </motion.div>
    
    {/* Discount badge */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: 'spring' }}
      className="relative mb-8"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-green-500 rounded-2xl blur-xl opacity-30" />
      <div className="relative glass-card rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Gift className="w-6 h-6 text-purple-400" />
          <span className="text-purple-400 font-semibold">BOLSA EXCLUSIVA</span>
        </div>
        <p className="text-white text-lg">
          <span className="font-bold">{userName}</span>, você acaba de ganhar uma bolsa de{' '}
          <span className="text-3xl font-bold text-gradient-purple">50% de desconto</span>{' '}
          para participar do Treinamento Mestre UGC.
        </p>
      </div>
    </motion.div>
    
    {/* Explanation */}
    <motion.p
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.7 }}
      className="text-zinc-400 mb-8 max-w-xl mx-auto"
    >
      O Mestre UGC é um treinamento completo que ensina como criar conteúdos simples para empresas 
      e ser pago por isso, mesmo começando do zero.
    </motion.p>
    
    {/* CTA Button */}
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.8 }}
    >
      <Button
        onClick={onCTA}
        size="lg"
        className="group relative px-10 py-7 text-lg font-semibold bg-gradient-to-r from-green-600 via-green-500 to-purple-500 hover:from-green-500 hover:via-green-400 hover:to-purple-400 text-white rounded-xl transition-all duration-300 animate-pulse-glow"
      >
        Quero garantir minha bolsa de 50% agora
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
    
    {/* Urgency */}
    <motion.p
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.9 }}
      className="mt-6 text-sm text-zinc-500"
    >
      Vagas limitadas com bolsa de 50% — não perca essa oportunidade
    </motion.p>
  </motion.div>
);

// Main App Component
function App() {
  const [currentStep, setCurrentStep] = useState<QuizStep>('intro');
  const [quizData, setQuizData] = useState<QuizData>({
    name: '',
    experience: '',
    comfortable: '',
    earnings: ''
  });
  const [direction, setDirection] = useState(1);

  const goToStep = useCallback((step: QuizStep, dir: number = 1) => {
    setDirection(dir);
    setCurrentStep(step);
  }, []);

  const updateQuizData = useCallback((key: keyof QuizData, value: string) => {
    setQuizData(prev => ({ ...prev, [key]: value }));
  }, []);

  // Step configurations
  const steps: QuizStep[] = ['intro', 'name', 'question1', 'question2', 'question3', 'result'];
  const currentStepIndex = steps.indexOf(currentStep);
  const totalQuestions = 4; // name + 3 questions
  const progressStep = Math.max(0, currentStepIndex - 1); // Start counting after intro

  const handleStart = () => goToStep('name');
  
  const handleNameContinue = () => {
    if (quizData.name.trim()) goToStep('question1');
  };

  const handleQuestion1 = (value: string) => {
    updateQuizData('experience', value);
    goToStep('question2');
  };

  const handleQuestion2 = (value: string) => {
    updateQuizData('comfortable', value);
    goToStep('question3');
  };

  const handleQuestion3 = (value: string) => {
    updateQuizData('earnings', value);
    goToStep('result');
  };

  const handleCTA = () => {
    // In a real app, this would redirect to the checkout page
    window.open('https://exemplo.com/mestre-ugc-checkout', '_blank');
  };

  // Question configurations
  const questions = {
    question1: {
      question: 'Você já tentou ganhar dinheiro na internet antes?',
      options: [
        { value: 'never', label: 'Nunca tentei', icon: Zap },
        { value: 'tried', label: 'Já tentei mas não consegui', icon: TrendingUp },
        { value: 'some', label: 'Já ganhei algum dinheiro online', icon: DollarSign },
        { value: 'current', label: 'Trabalho com internet atualmente', icon: Video },
      ]
    },
    question2: {
      question: 'Você se sentiria confortável gravando vídeos simples com seu celular?',
      options: [
        { value: 'yes', label: 'Sim', icon: Check },
        { value: 'maybe', label: 'Talvez', icon: Zap },
        { value: 'unsure', label: 'Não tenho certeza', icon: TrendingUp },
        { value: 'never', label: 'Nunca tentei', icon: Video },
      ]
    },
    question3: {
      question: 'Quanto você gostaria de ganhar por mês criando conteúdo?',
      options: [
        { value: '1000', label: 'Até R$1.000', icon: DollarSign },
        { value: '3000-5000', label: 'Entre R$3.000 e R$5.000', icon: DollarSign },
        { value: '5000-10000', label: 'Entre R$5.000 e R$10.000', icon: DollarSign },
        { value: '10000+', label: 'Mais de R$10.000', icon: DollarSign },
      ]
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <BackgroundEffects />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Mestre UGC</span>
          </motion.div>
          
          {currentStep !== 'intro' && currentStep !== 'result' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-zinc-500"
            >
              Quiz de Qualificação
            </motion.div>
          )}
        </div>
      </header>
      
      {/* Main content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center py-24 px-4">
        {/* Progress bar */}
        <AnimatePresence>
          {currentStep !== 'intro' && currentStep !== 'result' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-xl mx-auto mb-8"
            >
              <QuizProgress current={progressStep} total={totalQuestions} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Quiz content */}
        <div className="w-full max-w-3xl mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            {currentStep === 'intro' && (
              <IntroScreen key="intro" onStart={handleStart} />
            )}
            
            {currentStep === 'name' && (
              <NameScreen
                key="name"
                value={quizData.name}
                onChange={(value) => updateQuizData('name', value)}
                onContinue={handleNameContinue}
              />
            )}
            
            {currentStep === 'question1' && (
              <QuestionScreen
                key="question1"
                question={questions.question1.question}
                options={questions.question1.options}
                onSelect={handleQuestion1}
              />
            )}
            
            {currentStep === 'question2' && (
              <QuestionScreen
                key="question2"
                question={questions.question2.question}
                options={questions.question2.options}
                onSelect={handleQuestion2}
              />
            )}
            
            {currentStep === 'question3' && (
              <QuestionScreen
                key="question3"
                question={questions.question3.question}
                options={questions.question3.options}
                onSelect={handleQuestion3}
              />
            )}
            
            {currentStep === 'result' && (
              <ResultScreen
                key="result"
                userName={quizData.name}
                onCTA={handleCTA}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 py-6 px-4 text-center">
        <p className="text-xs text-zinc-600">
          © 2024 Mestre UGC. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

export default App;
