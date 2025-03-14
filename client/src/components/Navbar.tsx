import {
  ArrowUpDown,
  ArrowUpRight,
  Github,
  LineChart,
  Waves,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./dark-mode-toggle";
const Navbar = () => {
  return (
    <div className="flex flex-wrap items-center p-4 gap-3 justify-between sticky top-0 z-10 backdrop-blur-3xl border-b">
      <ul className="flex gap-5 items-center">
        <li>
          <Link to="/" className="flex gap-1">
            <Waves className="h-6 w-6" />
            <span>TokenBreeze</span>
          </Link>
        </li>
        <li>
          <a
            href="https://github.com/rahulsm20/tokenbreeze/blob/main/README.md"
            target="_blank"
            className="flex hover:underline"
          >
            <span>About</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/rahulsm20/tokenbreeze"
            target="_blank"
            className="flex items-center gap-1 hover:underline"
          >
            <span>Github</span>
            <Github className="h-4 w-4" />
          </a>
        </li>
        <Link
          to="/payments"
          className="flex items-center gap-1 hover:underline"
        >
          <a className="flex items-center gap-1 hover:underline">
            <span>Payments</span>
            <ArrowUpDown className="h-4 w-4" />
          </a>
        </Link>
        <Link to="/prices" className="flex items-center gap-1 hover:underline">
          <a className="flex items-center gap-1 hover:underline">
            <span>Prices</span>
            <LineChart className="h-4 w-4" />
          </a>
        </Link>
      </ul>
      <ModeToggle />
    </div>
  );
};

export default Navbar;
