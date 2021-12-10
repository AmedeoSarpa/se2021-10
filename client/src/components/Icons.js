const ticketIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
    width='16'
    height='16'>
    <path
      fill-rule='evenodd'
      fill='white'
      d='M4.75 2.5a.25.25 0 00-.25.25v9.91l3.023-2.489a.75.75 0 01.954 0l3.023 2.49V2.75a.25.25 0 00-.25-.25h-6.5zM3 2.75C3 1.784 3.784 1 4.75 1h6.5c.966 0 1.75.784 1.75 1.75v11.5a.75.75 0 01-1.227.579L8 11.722l-3.773 3.107A.75.75 0 013 14.25V2.75z'></path>
  </svg>
);

const userIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    fill='currentColor'
    class='bi bi-person-circle'
    viewBox='0 0 16 16'>
    <path d='M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' />
    <path
      fill-rule='evenodd'
      d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z'
    />
  </svg>
);

export { userIcon, ticketIcon };
