import { Github, Twitter } from "lucide-react";
import { Logo } from "./icons";

const Footer = () => {
  const socials = [
    {
      name: "Github",
      url: "https://github.com/rahulsm20/tokenbreeze",
      title: "Github",
      icon: <Github className="w-4 h-4" />,
    },
    {
      name: "Twitter",
      url: "https://twitter.com/boringBroccoli",
      title: "Twitter",
      icon: <Twitter className="w-4 h-4" />,
    },
  ];

  return (
    <footer className="border-t p-5 mt-10 gap-3 flex justify-around items-start bottom-0 text-xs">
      <div className="flex flex-col gap-2">
        <p className="text-start flex gap-2">
          <Logo className="w-4 h-4" /> TokenBreeze
        </p>
        <span className="text-zinc-500">
          Not just another token price aggregator.
        </span>
        <div className="flex flex-col gap-3">
          <ul className="flex gap-2 list-disc">
            {socials.map(({ name, url, title, icon }) => (
              <li key={name} className="flex gap-2">
                <a
                  href={url}
                  key={name}
                  target="_blank"
                  title={title}
                  className=" dark:text-zinc-300 hover:underline flex"
                >
                  {icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="flex gap-2 text-zinc-500">© 2024 TokenBreeze</p>
      </div>
    </footer>
  );
};

export default Footer;
