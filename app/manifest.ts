import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YAZ Education",
    short_name: "YAZ Education",
    description: "Study in Malaysia with YAZ Education.",
    start_url: "/en",
    display: "standalone",
    background_color: "#06111f",
    theme_color: "#06111f",
    icons: [
      {
        src: "/yaz-logo.png",
        sizes: "950x950",
        type: "image/png",
      },
    ],
  };
}
