import{c,r as d,u as x,j as e,B as a,I as u,J as o}from"./index-CkmDh-px.js";const m="/assets/arrow-ZgCs5hW6.avif",v=c("/")({component:p});function p(){const[t,n]=d.useState(""),l=x(),i=()=>{if(!t||!URL.canParse(t)){o.error("Invalid URL");return}const r=new URL(t).searchParams.get("v");if(!r){o.error("No video ID found");return}l({to:"/editor/$videoId",params:{videoId:r}})};return e.jsxs("div",{className:"min-h-screen flex flex-col items-center justify-center gap-10",children:[e.jsx("h1",{className:"text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500",children:"YouTube Clips"}),e.jsxs("div",{className:"flex items-center justify-center gap-2",children:[e.jsxs("div",{className:"relative",children:[e.jsx("img",{src:m,className:"hidden md:block absolute w-[200px] -left-[160px] -top-[130px] scale-[-1]",alt:"arrow"}),e.jsxs("div",{className:"hidden md:flex absolute -left-[170px] -top-[80px] gap-2 rotate-[-20deg]",children:[e.jsx(a,{className:"text-xl rotate-[-10deg] -translate-y-5",size:"icon",variant:"outline",children:"⌘"}),e.jsx(a,{className:"text-xl rotate-[10deg] -translate-x-4",size:"icon",variant:"outline",children:"V"})]}),e.jsx(u,{className:"min-w-[400px]",placeholder:"https://www.youtube.com/watch?v=dQw4w9WgXcQ",value:t,onChange:s=>n(s.target.value)})]}),e.jsx(a,{onClick:i,children:"Load video"})]})]})}export{v as Route};