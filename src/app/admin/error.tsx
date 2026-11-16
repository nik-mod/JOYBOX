'use client';
export default function AdminError({retry}:{retry:()=>void}){return <main id="main" className="admin-panel"><h1>მონაცემები ვერ ჩაიტვირთა</h1><p>შეამოწმეთ კავშირი და სცადეთ ხელახლა.</p><button onClick={retry}>ხელახლა ცდა</button></main>;}
