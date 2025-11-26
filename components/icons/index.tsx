import React from 'react';

// Generic Icon Props
type IconProps = { className?: string };

// Sidebar Icons
export const DashboardIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
export const UsersIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-6v-1a6 6 0 00-9-5.197" />
  </svg>
);
export const SettingsIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
export const ReportsIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
export const AppLogo = ({ className = "h-8 w-8 text-blue-600" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);

// Dashboard Icons
export const UserXIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
export const MoneyIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
  </svg>
);
export const InfoIcon = ({ className = "h-6 w-6" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
export const ShieldIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);


// Service Icons
export const MicrosoftIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className={className}><path d="M1.5 1.5h8v8h-8z" fill="#f25022"></path><path d="M11.5 1.5h8v8h-8z" fill="#7fba00"></path><path d="M1.5 11.5h8v8h-8z" fill="#00a4ef"></path><path d="M11.5 11.5h8v8h-8z" fill="#ffb900"></path></svg>
);
export const GoogleIcon = ({ className = "h-6 w-6" }: IconProps) => (
    <svg viewBox="0 0 48 48" className={className}><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
);
export const SlackIcon = ({ className = "h-6 w-6" }: IconProps) => (
    <svg viewBox="0 0 122.8 122.8" className={className}><path fill="#e01e5a" d="M25.8 77.6c0 6.8 5.6 12.4 12.4 12.4h11.2V77.6c0-6.8-5.6-12.4-12.4-12.4H25.8v12.4z"></path><path fill="#e01e5a" d="M38.1 77.6c-6.8 0-12.4-5.6-12.4-12.4V54h12.4c6.8 0 12.4 5.6 12.4 12.4v11.2z"></path><path fill="#36c5f0" d="M45.2 25.8c-6.8 0-12.4 5.6-12.4 12.4v11.2h12.4c6.8 0 12.4-5.6 12.4-12.4V25.8H45.2z"></path><path fill="#36c5f0" d="M45.2 38.2c0 6.8 5.6 12.4 12.4 12.4h11.2V38.2c0-6.8-5.6-12.4-12.4-12.4H45.2v12.4z"></path><path fill="#2eb67d" d="M97 45.2c0-6.8-5.6-12.4-12.4-12.4H73.4v12.4c0 6.8 5.6 12.4 12.4 12.4H97V45.2z"></path><path fill="#2eb67d" d="M84.7 45.2c6.8 0 12.4 5.6 12.4 12.4v11.2H84.7c-6.8 0-12.4-5.6-12.4-12.4V45.2z"></path><path fill="#ecb22e" d="M77.6 97c6.8 0 12.4-5.6 12.4-12.4V73.4H77.6c-6.8 0-12.4 5.6-12.4 12.4V97h12.4z"></path><path fill="#ecb22e" d="M77.6 84.7c0-6.8-5.6-12.4-12.4-12.4H54v12.4c0 6.8 5.6 12.4 12.4 12.4h11.2z"></path></svg>
);
export const HubspotIcon = ({ className = "h-6 w-6" }: IconProps) => (
    <svg viewBox="0 0 250 250" className={className}><path fill="#FF7A59" d="M125,0C56,0,0,56,0,125s56,125,125,125s125-56,125-125S194,0,125,0z M188,168c0,11-9,20-20,20h-86 c-11,0-20-9-20-20V82c0-11,9-20,20-20h86c11,0,20,9,20,20V168z M150,125c0,16-11,25-25,25s-25-9-25-25s11-25,25-25S150,109,150,125z"></path></svg>
);
export const JiraIcon = ({ className = "h-6 w-6" }: IconProps) => (
    <svg viewBox="0 0 24 24" className={className}><path fill="#2684FF" d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.1 17.1L12 12l-5.1 5.1L1.8 12l5.1-5.1L12 12l5.1-5.1L22.2 12l-5.1 5.1z"></path></svg>
);
export const SalesforceIcon = ({ className = "h-6 w-6" }: IconProps) => (
    <svg viewBox="0 0 512 512" className={className}><path fill="#00A1E0" d="M113.4 311.3c23.6-2.5 46.5-12.1 65.5-27.1 20-15.8 35.2-37.4 43.8-62.1 8.2-23.7 9.8-49.4 4.5-74.2-5.6-26.2-18.1-50-36.2-68.9-16.7-17.6-38.3-29.8-62-35.3-25.1-5.9-52.2-4.6-77.2 3.6-24 7.9-45.8 21.3-63.1 39.1-16.6 17.2-28.5 38.6-34.6 62.2-6.2 24-5.3 50.2 2.7 74.4 8.2 24.8 22.8 46.9 42.1 63.9 19.3 17 42.8 28.5 68.1 33.6 15.1 3 30.6 3.5 45.9 1.4zM262.8 191.1c-16.1-1.3-32-5.3-46.7-11.7-14-6.1-26.6-14.7-37-25.2-10-10.2-17.8-22.3-22.8-35.6-5.1-13.6-7.3-28.2-6.5-42.8 1.1-19.9 8.2-39 20.3-55.2 12.8-17.1 30.5-30.4 50.8-38.2 20-7.6 42.2-9.4 63.7-5.2 21.9 4.3 42.2 14.5 58.7 29.5s29 34.6 36.1 56.6c7.1 22 8.3 45.9 3.5 68.8-4.9 23.3-15.8 45.2-31.5 62.6-15.1 16.7-34.4 28.8-55.7 35.3-21.2 6.4-44 7-66.4 1.9-12.7-2.9-25-7.5-36.5-13.5 13-17.2 20.2-38 19.9-59.2-.3-23.5-8-46.1-22.2-64.8z"></path></svg>
);
export const ServiceNowIcon = ({ className = "h-6 w-6" }: IconProps) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" fill="#81B532"></path><path d="M12.6667 6.62183C12.6667 6.2572 12.3782 5.96875 12.0136 5.96875H11.9864C9.28889 5.96875 7.07019 8.125 6.99316 10.8229V10.875C6.99282 11.238 7.27985 11.5262 7.64287 11.5275H7.69531C8.01953 11.5275 8.28125 11.2656 8.28125 10.9414V10.8646C8.35828 8.875 9.97917 7.25391 11.9688 7.25391H12.0123C12.3769 7.25391 12.6667 6.96545 12.6667 6.60083V6.62183ZM16.3571 12.4725H16.3047C15.9805 12.4725 15.7188 12.7344 15.7188 13.0586V13.1354C15.6417 15.125 14.0208 16.7461 12.0312 16.7461H11.9877C11.6231 16.7461 11.3333 17.0346 11.3333 17.3992V17.3782C11.3333 17.7428 11.6218 18.0312 11.9864 18.0312H12.0136C14.7111 18.0312 16.9298 15.875 17.0068 13.1771V13.125C17.0072 12.762 16.7201 12.4738 16.3571 12.4725Z" fill="white"></path></svg>
);


// Table icons
export const FilterIcon = ({ className = "h-5 w-5 ml-1" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);
export const SortAscIcon = ({ className = "h-4 w-4 ml-1" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
  </svg>
);
export const SortDescIcon = ({ className = "h-4 w-4 ml-1" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4 4m0 0l4-4m-4 4V4" />
  </svg>
);
export const DownloadIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

// General UI Icons
export const BackArrowIcon = ({ className = "h-6 w-6" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

export const EyeIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

export const EyeOffIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.05 10.05 0 013.11-5.244m5.744-1.265A9.95 9.95 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.05 10.05 0 01-1.343 3.326m-6.433-2.331a3 3 0 10-4.243-4.243l4.243 4.243z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75l16.5 16.5" />
    </svg>
);

export const TrashIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const PlusIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

// Admin Layout Icons
export const KeyIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.629 5.629l-2.371 2.371a2.121 2.121 0 01-3 3L7.5 15.5l-2.086 2.086a2.121 2.121 0 01-3-3L7.5 9.5l-2.086-2.086a2.121 2.121 0 013-3L10.5 6.5l2.371-2.371A6 6 0 0121 11z" />
    </svg>
);

export const MailIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

export const ArrowLeftOnRectangleIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l-3-3m0 0l3-3m-3 3H5" />
    </svg>
);

export const BuildingLibraryIcon = ({ className = "h-6 w-6" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
);

export const PencilSquareIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

export const UserGroupIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-6v-1a6 6 0 00-9-5.197" />
    </svg>
);

export const CheckCircleIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const NoSymbolIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
);

export const ClipboardDocumentListIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export const DevicePhoneMobileIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H5.25A2.25 2.25 0 003 3.75v16.5a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0018 20.25V3.75A2.25 2.25 0 0015.75 1.5h-5.25m-2.625 10.5c1.243 1.243 2.86 1.864 4.5 1.864s3.257-.621 4.5-1.864m-8.625.75a4.507 4.507 0 018.25 0" />
    </svg>
);

export const GlobeAltIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM2.05 12a10.45 10.45 0 0019.9 0M2.05 12h19.9M12 2.05a10.45 10.45 0 000 19.9M12 2.05V21" />
    </svg>
);

export const ClockIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
