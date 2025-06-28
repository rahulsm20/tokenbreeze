import { ArrowUpRight, Home, LineChart } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { ModeToggle } from "./dark-mode-toggle";
import { Logo } from "./icons";

// ------------------------------------------------------

type NavItemProps = {
  name: string;
  href: string;
  external: boolean;
  icon: React.ReactNode;
};

// -----------------------------------------------------
const Navbar = () => {
  const navItems = [
    {
      name: "Home",
      href: "/",
      external: false,
      icon: <Home className="h-4 w-4" />,
    },
    {
      name: "Prices",
      href: "/prices",
      external: false,
      icon: <LineChart className="h-4 w-4" />,
    },
    {
      name: "About",
      href: "https://github.com/rahulsm20/tokenbreeze/blob/main/README.md",
      external: true,
      icon: <ArrowUpRight className="h-4 w-4" />,
    },
    {
      name: "Github",
      href: "https://github.com/rahulsm20/tokenbreeze",
      external: true,
      icon: <ArrowUpRight className="h-4 w-4" />,
    },
    // {
    //   name: "Payments",
    //   href: "/payments",
    //   external: false,
    //   icon: <Coins className="h-4 w-4" />,
    // },
  ];

  const NavItem = ({ name, href, external, icon }: NavItemProps) => {
    return (
      <li title={name}>
        <NavLink
          to={href}
          target={external ? "_blank" : undefined}
          className={`flex ${
            !external && "items-center"
          } gap-1 hover:underline`}
        >
          {<span>{name}</span>}
          {icon}
        </NavLink>
      </li>
    );
  };
  return (
    <div className="flex flex-wrap items-center p-3 gap-3 justify-between sticky top-0 z-10 backdrop-blur-3xl border-b w-full">
      <ul className="flex gap-5 items-center flex-wrap text-sm">
        <li>
          <Link to="/" className="gap-1 flex items-center">
            <Logo />
          </Link>
        </li>
        {navItems.map((item) => (
          <NavItem
            key={item.name}
            name={item.name}
            href={item.href}
            external={item.external}
            icon={item.icon}
          />
        ))}
      </ul>
      <ModeToggle />
    </div>
  );
};

export default Navbar;
