import { Logo } from "@/components/icons";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Book,
  Computer,
  RefreshCcw,
  Scroll,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

//-------------------------------------------------------------------------------

const Landing = () => {
  const FEATURES = [
    {
      id: 1,
      name: "Real-time price updates",
      description: "Get the latest token prices in real-time.",
      icon: <RefreshCcw />,
    },
    {
      id: 2,
      name: "Comprehensive token information",
      description: "Access detailed information about each token.",
      icon: <Scroll />,
    },
    {
      id: 3,
      name: "Multiple provider comparisons",
      description: "Compare prices from various providers.",
      icon: <Book />,
    },
    {
      id: 4,
      name: "User-friendly interface",
      description: "Navigate easily with our intuitive design.",
      icon: <Computer />,
    },
    // {
    //   id: 5,
    //   name: "Send and receive tokens",
    //   description: "Easily send or receive tokens with our platform.",
    //   icon: <Coins />,
    // },
    {
      id: 6,
      name: "No signup required",
      description: "Start using the platform without any signup.",
      icon: <User />,
    },
  ];

  const FeatureCard = ({
    feature,
  }: {
    feature: {
      id: number;
      name: string;
      description: string;
      icon?: JSX.Element;
    };
  }) => {
    return (
      <Card className="flex flex-col w-60 p-4 backdrop-blur-md items-start gap-2 hover:-translate-y-3 transition-transform duration-500 ease-in-out">
        <CardTitle className="text-start p-2">{feature.name}</CardTitle>
        <CardDescription className="text-start p-2">
          {feature.description}
        </CardDescription>
        {feature.icon && (
          <CardContent className="flex items-center justify-center p-2">
            <div className="flex flex-col gap-5">{feature.icon}</div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-10 gap-5">
        <h1 className="text-4xl flex gap-1 items-center">
          TokenBreeze
          <Logo />
        </h1>
        <p className="text-lg">Just another token price aggregator.</p>
        <Link to="/prices" className="flex items-center gap-1">
          <Button className="text-white bg-green-600 hover:bg-green-700 transition-colors duration-300">
            Start Exploring <ArrowRight className="inline h-4 w-4" />
          </Button>
        </Link>
        <section className="flex flex-col items-start justify-center gap-5 p-2 text-start">
          <h2 className="text-xl mb-4 underline underline-offset-8 text-start">
            Features
          </h2>
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:grid-cols-3 animate-accordion-up">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </section>
        </section>
      </div>
    </Layout>
  );
};

export default Landing;
