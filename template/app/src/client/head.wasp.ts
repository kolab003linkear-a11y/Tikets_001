import { type App } from "@wasp.sh/spec";

export const head: App["head"] = [
  "<link rel='icon' href='/favicon.ico' />",

  "<meta name='description' content='TiketsLinkear: gestión móvil de eventos y entradas para OchoyMedio en Quito.' />",
  "<meta name='author' content='TiketsLinkear' />",
  "<meta name='keywords' content='TiketsLinkear, entradas, eventos, OchoyMedio, Quito, cine, teatro' />",

  "<meta property='og:type' content='website' />",
  "<meta property='og:title' content='TiketsLinkear' />",
  "<meta property='og:site_name' content='TiketsLinkear' />",
  "<meta property='og:url' content='https://your-saas-app.com' />",
  "<meta property='og:description' content='Gestiona eventos y entradas para OchoyMedio desde una app móvil.' />",
  "<meta property='og:image' content='https://your-saas-app.com/public-banner.webp' />",
  "<meta name='twitter:image' content='https://your-saas-app.com/public-banner.webp' />",
  "<meta name='twitter:image:width' content='800' />",
  "<meta name='twitter:image:height' content='400' />",
  "<meta name='twitter:card' content='summary_large_image' />",
  // TODO: You can put your Plausible analytics scripts below (https://docs.opensaas.sh/guides/analytics/):
  // NOTE: Plausible does not use Cookies, so you can simply add the scripts here.
  // Google, on the other hand, does, so you must instead add the script dynamically
  // via the Cookie Consent component after the user clicks the "Accept" cookies button.
  "<script async data-domain='<your-site-id>' src='https://plausible.io/js/script.js'></script>", // for production
  "<script async data-domain='<your-site-id>' src='https://plausible.io/js/script.local.js'></script>", // for development
];
