# Hirak Motion website

Company website for Hirak Motion, built with Next.js 16, React 19, Tailwind CSS 4, Motion and three.js.

## Run it locally

Node.js 24 LTS is installed in `~/.local` (already on your PATH).

```bash
cd ~/Hirak/website
npm install        # first time only
npm run dev        # open http://localhost:3000
```

## Build for production

```bash
npm run build      # outputs a static site to out/
npm start          # preview the built site at http://localhost:3000
```

`out/` is plain HTML, CSS and JS, so it can be hosted anywhere.

## Put it on the internet

The easiest free option is Vercel:

1. Push this folder to a GitHub repository.
2. Go to vercel.com, choose **Add New → Project**, and import the repository. The defaults work.
3. Under **Settings → Domains**, add your domain (for example `hirakmotion.com`) and follow the DNS steps.

Netlify and Cloudflare Pages work the same way. Use build command `npm run build` and output folder `out`.

## Before you launch

- `src/lib/site.ts`: set your real domain, email and social links.
- Contact form: create a free form endpoint (for example on Formspree) and set it as
  `NEXT_PUBLIC_FORM_ENDPOINT` in your hosting settings. Without it, the form opens the visitor's email app.
- `src/components/Lab.tsx`: the build log. Add new prototypes here as you build them.
- `src/components/Contact.tsx` (`NameStory`): the name section. Edit it if you confirm a different meaning of "Hirak".
- `public/og.png`: the preview image shown when the link is shared.

## Where things live

| File | Section |
|---|---|
| `src/components/Hero.tsx`, `CycloidScene.tsx` | Hero and the live 3D cycloidal drive |
| `src/components/MotionStack.tsx` | "From magnet to motion" value chain |
| `src/components/Platform.tsx` | Product families |
| `src/components/Explorer.tsx` | Interactive actuator trade-off explorer |
| `src/components/Custom.tsx` | Custom actuator process |
| `src/components/Why.tsx` | Mission, sourced stats and principles |
| `src/components/Lab.tsx` | Build log |
| `src/components/Roadmap.tsx` | Roadmap |
| `src/components/Contact.tsx` | Name story and contact form |
| `src/lib/cycloid.ts` | Cycloidal drive geometry used by the 3D scene, logo and drawings |
