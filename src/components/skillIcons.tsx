 import React from 'react';

/**
 * Skill icon set — every icon is drawn on the same 24×24 grid so the orbit
 * nodes read as one system. Two construction styles are used:
 *
 *   1. Geometric marks for logos that are reliably reproducible with primitives
 *      (React, Node, MongoDB, Git, Vite, shields, cylinders…).
 *   2. Monogram tiles (rounded square + wordmark) for logos whose real artwork
 *      is too intricate to redraw at 24px without looking broken.
 *
 * Both styles share the same optical weight, so a mixed ring still looks even.
 */

type IconProps = React.SVGProps<SVGSVGElement>;
type Icon = React.FC<IconProps>;

const MONO_FONT = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
const SANS_FONT = "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif";

/** Rounded tile + wordmark. Used for logos that don't survive being redrawn. */
function monogram(
  label: string,
  bg: string,
  fg = '#FFFFFF',
  opts: { fontSize?: number; font?: string; dy?: number } = {},
): Icon {
  const { fontSize = 9.5, font = SANS_FONT, dy = 0 } = opts;

  const Component: Icon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" rx="5.5" fill={bg} />
      <text
        x="12"
        y={12 + dy}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={font}
        fontSize={fontSize}
        fontWeight="700"
        letterSpacing="-0.4"
        fill={fg}
      >
        {label}
      </text>
    </svg>
  );

  Component.displayName = `SkillIcon(${label})`;
  return Component;
}

/* ─── Languages ──────────────────────────────────────────── */

const JavaScriptIcon = monogram('JS', '#F7DF1E', '#111111', { fontSize: 10 });
const TypeScriptIcon = monogram('TS', '#3178C6', '#FFFFFF', { fontSize: 10 });
const PhpIcon = monogram('php', '#777BB4', '#FFFFFF', { fontSize: 8, font: MONO_FONT });

const PythonIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M11.6 2h.9c2.6 0 3.9.9 3.9 2.9V9H11c-2.1 0-3.7 1.6-3.7 3.6v1.8H5.6C3.6 14.4 2.6 13 2.6 10.4S3.6 6.6 5.6 6.6h6.9v-.9H7.7V4.9C7.7 2.9 9 2 11.6 2Z"
      fill="#3776AB"
    />
    <path
      d="M12.4 22h-.9c-2.6 0-3.9-.9-3.9-2.9V15H13c2.1 0 3.7-1.6 3.7-3.6V9.6h1.7c2 0 3 1.4 3 4s-1 4-3 4h-6.9v.9h4.8v.8c0 2-1.3 2.7-3.9 2.7Z"
      fill="#FFD43B"
    />
    <circle cx="10.1" cy="4.7" r=".95" fill="#FFFFFF" />
    <circle cx="13.9" cy="19.3" r=".95" fill="#3C6E9B" />
  </svg>
);

const JavaIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M10.6 2.5c1.6 1.5 1.9 2.6.9 3.9-1.1 1.4-1.2 2.4-.2 3.4M14.3 4.6c1.1 1.1 1.2 1.9.4 2.9-.8 1-.8 1.8 0 2.6"
      stroke="#E76F51"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M6.5 11.5h10v3.6a3.4 3.4 0 0 1-3.4 3.4h-3.2a3.4 3.4 0 0 1-3.4-3.4v-3.6Z"
      fill="#5382A1"
    />
    <path
      d="M17 12.4h.9a2 2 0 0 1 0 4H17"
      stroke="#5382A1"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path d="M5.5 20.3c2 .9 10.9.9 13 0" stroke="#E76F51" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SqlIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M4 6.2v11.6c0 1.6 3.6 2.9 8 2.9s8-1.3 8-2.9V6.2"
      stroke="#38BDF8"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <ellipse cx="12" cy="6.2" rx="8" ry="2.9" fill="#38BDF8" fillOpacity="0.28" stroke="#38BDF8" strokeWidth="1.6" />
    <path d="M4 12c0 1.6 3.6 2.9 8 2.9s8-1.3 8-2.9" stroke="#38BDF8" strokeWidth="1.6" />
  </svg>
);

const Html5Icon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M3.6 2.5h16.8l-1.5 17.2L12 21.5l-6.9-1.8L3.6 2.5Z" fill="#E34F26" />
    <path d="M12 4.3v15.4l5.5-1.5 1.3-13.9H12Z" fill="#EF652A" />
    <path
      d="M7.6 6.9h8.8l-.25 2.6h-6.1l.18 2h5.74l-.7 5.2-3.27.95-3.28-.95-.22-2.4h1.85l.12 1.2 1.53.42 1.53-.42.18-1.9H7.98L7.6 6.9Z"
      fill="#FFFFFF"
    />
  </svg>
);

const Css3Icon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M3.6 2.5h16.8l-1.5 17.2L12 21.5l-6.9-1.8L3.6 2.5Z" fill="#1572B6" />
    <path d="M12 4.3v15.4l5.5-1.5 1.3-13.9H12Z" fill="#33A9DC" />
    <path
      d="M7.6 6.9h8.8l-.25 2.6h-6.1l.18 2h5.74l-.7 5.2-3.27.95-3.28-.95-.22-2.4h1.85l.12 1.2 1.53.42 1.53-.42.18-1.9H7.98L7.6 6.9Z"
      fill="#FFFFFF"
    />
  </svg>
);

/* ─── Frameworks & libraries ─────────────────────────────── */

const ReactIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="2.1" fill="#61DAFB" />
    <g stroke="#61DAFB" strokeWidth="1.3" fill="none">
      <ellipse cx="12" cy="12" rx="9.2" ry="3.6" />
      <ellipse cx="12" cy="12" rx="9.2" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9.2" ry="3.6" transform="rotate(120 12 12)" />
    </g>
  </svg>
);

const LaravelIcon = monogram('L', '#FF2D20', '#FFFFFF', { fontSize: 12 });
const ExpressIcon = monogram('ex', '#1F2937', '#F3EDE2', { fontSize: 9, font: MONO_FONT });

const NodeIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 1.8 21 7v10l-9 5.2L3 17V7l9-5.2Z" fill="#5FA04E" />
    <path
      d="M14.4 15.2v-6.4M9.6 8.8v6.4l4.8-2.6"
      stroke="#0F1A0C"
      strokeOpacity="0.55"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 4.4 18.5 8.2v7.6L12 19.6 5.5 15.8V8.2L12 4.4Z" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1" />
  </svg>
);

const TailwindIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12 6.2c-2.7 0-4.3 1.35-5 4.05 1-1.35 2.2-1.86 3.5-1.52.75.2 1.28.74 1.87 1.34.97.98 2.09 2.13 4.53 2.13 2.7 0 4.3-1.35 5-4.05-1 1.35-2.2 1.86-3.5 1.52-.75-.2-1.28-.74-1.87-1.34C15.56 7.35 14.44 6.2 12 6.2Z"
      fill="#38BDF8"
    />
    <path
      d="M7 12.35c-2.7 0-4.3 1.35-5 4.05 1-1.35 2.2-1.86 3.5-1.52.75.2 1.28.74 1.87 1.34.97.98 2.09 2.13 4.53 2.13 2.7 0 4.3-1.35 5-4.05-1 1.35-2.2 1.86-3.5 1.52-.75-.2-1.28-.74-1.87-1.34-.97-.98-2.09-2.13-4.53-2.13Z"
      fill="#0EA5E9"
    />
  </svg>
);

const BootstrapIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect width="24" height="24" rx="5.5" fill="#7952B3" />
    <path
      d="M7.6 6.3h4.9c1.9 0 3 .9 3 2.4 0 1.05-.6 1.85-1.6 2.1v.1c1.3.2 2.05 1.05 2.05 2.35 0 1.7-1.3 2.75-3.4 2.75H7.6V6.3Zm2.45 3.85h1.85c.8 0 1.25-.35 1.25-.95s-.45-.95-1.25-.95h-1.85v1.9Zm0 3.95h2.05c.9 0 1.4-.4 1.4-1.1 0-.7-.5-1.1-1.4-1.1h-2.05v2.2Z"
      fill="#FFFFFF"
    />
  </svg>
);

/* ─── Databases & storage ────────────────────────────────── */

const MongoDbIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 1.6s-6.4 5.9-6.4 11c0 3.6 2.8 6.3 6.4 6.6 3.6-.3 6.4-3 6.4-6.6 0-5.1-6.4-11-6.4-11Z" fill="#47A248" />
    <path d="M12 1.6v17.6c3.6-.3 6.4-3 6.4-6.6 0-5.1-6.4-11-6.4-11Z" fill="#3F8A40" />
    <path d="M12 19.2v3" stroke="#B4D9B4" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const MySqlIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M3.8 6.4v11.2c0 1.6 3.7 2.9 8.2 2.9s8.2-1.3 8.2-2.9V6.4"
      stroke="#00758F"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <ellipse cx="12" cy="6.4" rx="8.2" ry="2.9" fill="#00758F" fillOpacity="0.3" stroke="#00758F" strokeWidth="1.6" />
    <path d="M3.8 12c0 1.6 3.7 2.9 8.2 2.9s8.2-1.3 8.2-2.9" stroke="#F29111" strokeWidth="1.6" />
    <path d="M13.4 17.8c2.4-.15 4.3-1 4.3-2.05" stroke="#F29111" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const OracleIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="2.6" y="7.2" width="18.8" height="9.6" rx="4.8" stroke="#F80000" strokeWidth="2.6" fill="none" />
  </svg>
);

const MongooseIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 1.9s-5.8 5.4-5.8 10.1c0 3.3 2.6 5.8 5.8 6.1 3.2-.3 5.8-2.8 5.8-6.1 0-4.7-5.8-10.1-5.8-10.1Z" fill="#880000" />
    <path d="M12 1.9v16.2c3.2-.3 5.8-2.8 5.8-6.1 0-4.7-5.8-10.1-5.8-10.1Z" fill="#6B0000" />
    <path
      d="M8.9 11.6v3.1m0-3.1 3.1 1.9 3.1-1.9m0 0v3.1"
      stroke="#F3D0C4"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloudinaryIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M6.6 19.2A4.3 4.3 0 0 1 6.1 10.7 6.6 6.6 0 0 1 18.6 12a4.1 4.1 0 0 1 .5 7.2H6.6Z"
      fill="#3448C5"
      fillOpacity="0.85"
    />
    <path
      d="M12 16.8v-6m0 0-2.4 2.4M12 10.8l2.4 2.4"
      stroke="#FFFFFF"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─── Tools & ecosystem ──────────────────────────────────── */

const GitIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect
      x="12"
      y="0.6"
      width="16.1"
      height="16.1"
      rx="3"
      transform="rotate(45 12 .6)"
      fill="#F05032"
      fillOpacity="0.18"
      stroke="#F05032"
      strokeWidth="1.5"
    />
    <path d="M9 15V9.6a1 1 0 0 1 1-1h4.2M14.6 12.8V9" stroke="#F05032" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="9" cy="16.4" r="1.7" fill="#F05032" />
    <circle cx="14.6" cy="14.2" r="1.7" fill="#F05032" />
    <circle cx="9" cy="7.6" r="1.7" fill="#F05032" />
  </svg>
);

const GitHubIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      fill="currentColor"
    />
  </svg>
);

const RestApiIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="3.4" fill="#38BDF8" fillOpacity="0.25" stroke="#38BDF8" strokeWidth="1.6" />
    <circle cx="12" cy="3.4" r="1.9" fill="#38BDF8" />
    <circle cx="12" cy="20.6" r="1.9" fill="#38BDF8" />
    <circle cx="3.6" cy="12" r="1.9" fill="#7DD3FC" />
    <circle cx="20.4" cy="12" r="1.9" fill="#7DD3FC" />
    <path d="M12 5.3v3.3M12 15.4v3.3M5.5 12h3.1M15.4 12h3.1" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const JwtIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 2.2 4.6 5.6v6c0 4.9 3.2 8.9 7.4 10.2 4.2-1.3 7.4-5.3 7.4-10.2v-6L12 2.2Z" fill="#1B1035" stroke="#A855F7" strokeWidth="1.4" />
    <circle cx="8.3" cy="11.6" r="1.5" fill="#EC4899" />
    <circle cx="12" cy="11.6" r="1.5" fill="#06B6D4" />
    <circle cx="15.7" cy="11.6" r="1.5" fill="#EAB308" />
    <path d="M8.6 15.4h6.8" stroke="#A855F7" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const MulterIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M3.6 14.4v3.4a2.2 2.2 0 0 0 2.2 2.2h12.4a2.2 2.2 0 0 0 2.2-2.2v-3.4" stroke="#E8A87C" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 3.9v10.6m0-10.6L8.2 7.7M12 3.9l3.8 3.8" stroke="#E8A87C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ViteIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M22 4.3 12.6 21.6a.7.7 0 0 1-1.2 0L2 4.3a.7.7 0 0 1 .7-1l9 1.6a.7.7 0 0 0 .25 0l8.8-1.6a.7.7 0 0 1 .75 1Z" fill="#646CFF" />
    <path d="M15.5 2.6 9.2 13.4h3.1l-1.8 5.9 6.9-10.6h-3.3l1.4-6.1Z" fill="#FFC914" />
  </svg>
);

const UmlIcon: Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="2.6" y="2.8" width="7.6" height="5.4" rx="1.4" fill="#D9A441" fillOpacity="0.28" stroke="#D9A441" strokeWidth="1.4" />
    <rect x="13.8" y="2.8" width="7.6" height="5.4" rx="1.4" fill="#D9A441" fillOpacity="0.28" stroke="#D9A441" strokeWidth="1.4" />
    <rect x="8.2" y="15.8" width="7.6" height="5.4" rx="1.4" fill="#D9A441" fillOpacity="0.28" stroke="#D9A441" strokeWidth="1.4" />
    <path d="M6.4 8.2v3.2h11.2V8.2M12 11.4v4.4" stroke="#D9A441" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── Fallback ───────────────────────────────────────────── */

const DefaultSkillIcon: Icon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="4.6" fill="currentColor" fillOpacity="0.12" />
    <path d="M9.4 9.2 12.2 12l-2.8 2.8M13.6 14.8h2.8" />
  </svg>
);

/* ─── Resolver ───────────────────────────────────────────── */

/**
 * Ordered longest-match-first: `mongoose` must be tested before `mongo`,
 * `mysql` before `sql`, `javascript` before `java`.
 */
const ICON_RULES: Array<[RegExp, Icon]> = [
  [/^(js|javascript|es6|ecmascript)/, JavaScriptIcon],
  [/^(ts|typescript)/, TypeScriptIcon],
  [/python|django|flask/, PythonIcon],
  [/^java(?!script)/, JavaIcon],
  [/php/, PhpIcon],
  [/html/, Html5Icon],
  [/tailwind/, TailwindIcon],
  [/css|sass|scss/, Css3Icon],
  [/react|nextjs|next\b/, ReactIcon],
  [/laravel/, LaravelIcon],
  [/express/, ExpressIcon],
  [/node/, NodeIcon],
  [/bootstrap/, BootstrapIcon],
  [/mongoose/, MongooseIcon],
  [/mongo/, MongoDbIcon],
  [/mysql|mariadb/, MySqlIcon],
  [/oracle/, OracleIcon],
  [/postgres|sqlite|^sql|database/, SqlIcon],
  [/cloudinary/, CloudinaryIcon],
  [/github/, GitHubIcon],
  [/^git/, GitIcon],
  [/rest|api|graphql/, RestApiIcon],
  [/jwt|auth|oauth/, JwtIcon],
  [/multer|upload/, MulterIcon],
  [/vite|webpack|rollup/, ViteIcon],
  [/uml|diagram|merise/, UmlIcon],
];

export function getSkillIcon(skillName: string): Icon {
  const norm = skillName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const hit = ICON_RULES.find(([pattern]) => pattern.test(norm));
  return hit ? hit[1] : DefaultSkillIcon;
}

export default getSkillIcon;
