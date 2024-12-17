import { ArrowUpRight, Waves } from "lucide-react";

const Footer = () => {
  const socials = [
    {
      name: "Github",
      url: "https://github.com/rahulsm20/tokentide",
    },
    {
      name: "Twitter",
      url: "https://twitter.com/",
    },
  ];

  return (
    <footer className="border-t p-5 mt-10 gap-3 flex justify-around items-start bottom-0">
      <div className="flex flex-col gap-2">
        <p className="text-lg text-start flex gap-2">
          <Waves /> TokenTide
        </p>
        <span className="text-sm text-zinc-500">
          Just another token price aggregator.
        </span>
        <div className="flex flex-col gap-3">
          <ul className="flex gap-2 list-disc ">
            {socials.map(({ name, url }) => (
              <li key={name} className="flex gap-2">
                <a
                  href={url}
                  key={name}
                  target="_blank"
                  className=" dark:text-zinc-300 hover:underline flex"
                >
                  {name}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="flex gap-2 text-zinc-500 text-xs">© 2024 TokenTide</p>
      </div>
    </footer>
  );
};

export default Footer;
