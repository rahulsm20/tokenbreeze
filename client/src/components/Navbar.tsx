import { ArrowUpDown, ArrowUpRight, LineChart } from "lucide-react";
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
      name: "Prices",
      href: "/prices",
      external: false,
      icon: <LineChart className="h-4 w-4" />,
    },
    {
      name: "Payments",
      href: "/payments",
      external: false,
      icon: <ArrowUpDown className="h-4 w-4" />,
    },
    {
      name: "About",
      href: "https://github.com/rahulsm20/tokenbreeze/blob/main/README.md",
      external: true,
      icon: <ArrowUpRight className="h-3 w-3" />,
    },
    {
      name: "Github",
      href: "https://github.com/rahulsm20/tokenbreeze",
      external: true,
      icon: <ArrowUpRight className="h-3 w-3" />,
    },
  ];

  const NavItem = ({ name, href, external, icon }: NavItemProps) => {
    return (
      <li title={name} className="font-medium">
        <NavLink
          to={href}
          target={external ? "_blank" : undefined}
          className={`flex ${
            !external ? "items-center gap-2" : ""
          } hover:underline`}
        >
          {<span>{name}</span>}
          {external && icon}
          {!external && <span className="md:flex hidden">{icon}</span>}
        </NavLink>
      </li>
    );
  };

  return (
    <div className="flex flex-wrap items-center p-2 gap-3 justify-center sticky top-0 z-10 backdrop-blur-3xl w-full border-b">
      <ul className="flex gap-5 items-center flex-wrap text-xs">
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
        <ModeToggle />
      </ul>
    </div>
  );
};

export default Navbar;
