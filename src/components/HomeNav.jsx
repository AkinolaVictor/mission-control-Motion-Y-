import Link from 'next/link';
import React from 'react';

function HomeNav({
    activePill = 'Activities',
    where="Home"
}) {
    const pills = [
      { 
        label: 'Activities', 
        path: '/', 
        icon:  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity preview-icon"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>
      },
      { 
        label: 'Ideas', 
        path: '/ideas', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb preview-icon"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> 
      },
      { 
        label: 'News', 
        path: '/news', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rss preview-icon"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
      },
    ];

    const content = [
      { 
        label: 'Published', 
        path: '/contents', 
        icon:  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-check preview-icon"><path d="M12 5v16"/><path d="m16 12 2 2 4-4"/><path d="M22 6V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2h4.001A2 2 0 0022 17v-1.344"/></svg>,
        // icon:  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen preview-icon"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
      },
      { 
        label: 'Failed', 
        path: '/contents/failed', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x preview-icon"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
      }
    ];

    const tasks = [
      { 
        label: 'Ongoing', 
        path: '/tasks', 
        icon:  (
            <svg xmlns="http://www.w3.org/2000/svg" width="15.722" height="14.168" viewBox="0 0 15.722 14.168">
              <g id="Group_87" data-name="Group 87" transform="translate(-2.35 -3.326)">
                <path id="Path_56" data-name="Path 56" d="M9.427,4.228A1.6,1.6,0,0,0,7,5.6v9.615a1.6,1.6,0,0,0,2.427,1.374l8.01-4.806a1.6,1.6,0,0,0,0-2.75Z" transform="translate(-0.795)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3"/>
                <path id="Path_57" data-name="Path 57" d="M3,4V16.82" transform="translate(0 0)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3"/>
              </g>
            </svg>
        )
      },
      { 
        label: 'Scheduled', 
        path: '/tasks/scheduled', 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="14.3" height="14.3" viewBox="0 0 14.3 14.3">
            <g id="Group_86" data-name="Group 86" transform="translate(-2.35 -1.35)">
              <path id="Path_52" data-name="Path 52" d="M8,2V4.063" transform="translate(-1.583)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3"/>
              <path id="Path_53" data-name="Path 53" d="M16,2V4.063" transform="translate(-4.117)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3"/>
              <rect id="Rectangle_61" data-name="Rectangle 61" width="13" height="12" rx="2" transform="translate(3 3)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3"/>
              <path id="Path_54" data-name="Path 54" d="M3,9H15.3" transform="translate(0 -2.186)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3"/>
              <path id="Path_55" data-name="Path 55" d="M9,14.375l1.375,1.375L13.126,13" transform="translate(-1.563 -3.436)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3"/>
            </g>
          </svg>
        )
      },
      { 
        label: 'Completed', 
        path: '/tasks/completed', 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18.3" height="18.3" viewBox="0 0 18.3 18.3">
            <g id="Group_84" data-name="Group 84" transform="translate(-1.35 -1.35)">
              <circle id="Ellipse_10" data-name="Ellipse 10" cx="8.5" cy="8.5" r="8.5" transform="translate(2 2)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3"/>
              <path id="Path_51" data-name="Path 51" d="M14.868,9l-4.722,4.722L8,11.576" transform="translate(-0.849 -0.99)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3"/>
            </g>
          </svg>
        )
      }
    ];

    const agents = [
      { 
        label: 'Agents', 
        path: '/agents', 
        icon:  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hat-glasses preview-icon"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg>
      },
      // { 
      //   label: 'Teams', 
      //   path: '/agents', 
      //   icon:  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-group preview-icon"><path d="M17 21a5 5 0 00-10 0"/><path d="M22 10.5a3.5 3.5 0 00-5.507-2.868"/><path d="M7.507 7.632A3.5 3.5 0 002 10.5"/><circle cx="12" cy="13" r="3"/><circle cx="18.5" cy="4.5" r="2.5"/><circle cx="5.5" cy="4.5" r="2.5"/></svg>
      // },
      // { 
      //   label: 'Workflows', 
      //   path: '/agents', 
      //   icon:  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share-2 preview-icon"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
      // },
      { 
        label: 'Approvals', 
        path: '/agents/approvals', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-stamp preview-icon"><path d="M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13"/><path d="M20 15.5a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1z"/><path d="M5 22h14"/></svg>
      }
    ];

    const data = {
      Home: pills,
      Contents: content,
      Tasks: tasks,
      Agents: agents
    }[where] || pills;

    return (
        <div className="homenav w-full flex items-center gap-3">
          {data.map((pill) => (
            <Link
              key={pill.label}
              href={pill.path}
              className={`flex items-center gap-2 ${activePill===pill.label?"px-4":"px-2"} py-2 rounded-full text-sm font-medium transition-colors ${
                activePill === pill.label
                  ? 'bg-surface text-foreground'
                  : 'bg-transparent text-text-secondary hover:text-foreground'
              }`}
            >
              <span>{pill.icon}</span> {pill.label}
            </Link>
          ))}

          {
            where === "Agents" && activePill!=="New Agent"?
            (
              <Link href="/agents/newAgent" className={`ml-auto`}>
                <div className={`w-auto h-auto px-4 py-2 rounded-full ${activePill!=="New Agent"?"bg-surface":"bg-layer3"} flex justify-center items-center cursor-pointer`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus preview-icon"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    <p className='text-xs text-foreground ml-2'>New Agent</p>
                </div>
              </Link>
            ): 
            null
          }
        </div>
    );
}

export default HomeNav;